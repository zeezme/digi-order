import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { CredentialRepository } from './credential.repository';
import { User } from '../user/entities/user.entity';
import { Credential } from './entities/credential.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  ver: number;
}

@Injectable()
export class CredentialService {
  private readonly SALT_ROUNDS = 12;
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_MINUTES = 15;
  private readonly ACCESS_TOKEN_EXPIRY = '15m';
  private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createPassword(user: User, password: string): Promise<Credential> {
    const existing = await this.credentialRepository.findOne({ user });

    if (existing) {
      throw new ConflictException('Usuário já possui senha');
    }

    const hash = await bcrypt.hash(password, this.SALT_ROUNDS);

    const credential = new Credential();
    credential.user = user;
    credential.passwordHash = hash;
    credential.passwordUpdatedAt = new Date();

    await this.credentialRepository
      .getEntityManager()
      .persist(credential)
      .flush();

    return credential;
  }

  async login({ email, password }: { email: string; password: string }) {
    const credential = await this.credentialRepository.findOne(
      { user: { email } },
      {
        populate: [
          'user',
          'user.userRoles',
          'user.userRoles.role',
          'user.userRoles.role.permissionEntities',
        ],
      },
    );

    if (!credential) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (credential.lockedUntil && credential.lockedUntil > new Date()) {
      throw new ForbiddenException('Usuário temporariamente bloqueado');
    }

    const isValid = await bcrypt.compare(password, credential.passwordHash);

    if (!isValid) {
      await this.handleFailedAttempt(credential);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Reset tentativas e gera novos tokens
    credential.failedAttempts = 0;
    credential.lockedUntil = undefined;

    const tokens = await this.generateTokens(credential);

    await this.credentialRepository
      .getEntityManager()
      .persist(credential)
      .flush();

    const permissions = new Set<string>();
    for (const userRole of credential.user.userRoles) {
      for (const perm of userRole.role.permissionEntities) {
        permissions.add(perm.key);
      }
    }

    return {
      ...tokens,
      user: {
        id: credential.user.id,
        email: credential.user.email,
        name: credential.user.name,
      },
      permissions: Array.from(permissions),
    };
  }

  async refresh(refreshToken: string) {
    const credential = await this.credentialRepository.findOne(
      { refreshToken },
      { populate: ['user'] },
    );

    if (!credential) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (
      !credential.refreshTokenExpiresAt ||
      credential.refreshTokenExpiresAt < new Date()
    ) {
      // Limpa
      credential.refreshToken = undefined;
      credential.refreshTokenExpiresAt = undefined;

      await this.credentialRepository
        .getEntityManager()
        .persist(credential)
        .flush();

      throw new UnauthorizedException('Refresh token expirado');
    }

    // Gera novos tokens (rotaciona o refresh token também)
    const tokens = await this.generateTokens(credential);

    await this.credentialRepository
      .getEntityManager()
      .persist(credential)
      .flush();

    return tokens;
  }

  async logout(userId: number) {
    const credential = await this.credentialRepository.findOneOrFail({
      user: { id: userId },
    });

    credential.tokenVersion += 1;
    credential.refreshToken = undefined;
    credential.refreshTokenExpiresAt = undefined;

    await this.credentialRepository
      .getEntityManager()
      .persist(credential)
      .flush();
  }

  async changePassword(user: User, oldPassword: string, newPassword: string) {
    const credential = await this.credentialRepository.findOneOrFail({ user });

    const valid = await bcrypt.compare(oldPassword, credential.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Senha atual inválida');
    }

    const newHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

    credential.passwordHash = newHash;
    credential.passwordUpdatedAt = new Date();
    credential.failedAttempts = 0;
    credential.lockedUntil = undefined;

    // Invalida tokens existentes
    credential.tokenVersion += 1;
    credential.refreshToken = undefined;
    credential.refreshTokenExpiresAt = undefined;

    await this.credentialRepository
      .getEntityManager()
      .persist(credential)
      .flush();
  }

  /**
   * Incrementa a versão do token, gera novo accessToken e refreshToken
   */
  private async generateTokens(credential: Credential) {
    credential.tokenVersion += 1;

    const payload: JwtPayload = {
      sub: credential.user.id,
      email: credential.user.email,
      ver: credential.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });

    // Refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(
      refreshTokenExpiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS,
    );

    credential.refreshToken = refreshToken;
    credential.refreshTokenExpiresAt = refreshTokenExpiresAt;

    return { accessToken, refreshToken };
  }

  private async handleFailedAttempt(credential: Credential) {
    credential.failedAttempts += 1;

    if (credential.failedAttempts >= this.MAX_ATTEMPTS) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + this.LOCK_MINUTES);
      credential.lockedUntil = lockUntil;
    }

    await this.credentialRepository
      .getEntityManager()
      .persist(credential)
      .flush();
  }
}
