import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyService } from '@src/modules/auth-ms/company/company.service';
import { UserService } from '@src/modules/auth-ms/user/user.service';
import { CredentialRepository } from '@src/modules/auth-ms/credential/credential.repository';
import { JwtPayload } from '@src/modules/auth-ms/credential/credential.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly credentialRepository: CredentialRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // Valida a versão do token contra o banco
      const credential = await this.credentialRepository.findOneOrFail({
        user: { id: payload.sub },
      });

      if (credential.tokenVersion !== payload.ver) {
        throw new UnauthorizedException('Token invalidado');
      }

      const localUser = await this.userService.findOne(payload.sub);

      if (!localUser) {
        throw new UnauthorizedException('Usuário não encontrado no sistema');
      }

      const company = await this.companyService.findOne(localUser.companyId);

      if (!company) {
        throw new UnauthorizedException(
          'Usuário ainda não configurado na empresa',
        );
      }

      request.user = localUser;
      request.company = company;
      request.companyId = company.id;

      return true;
    } catch (err: any) {
      if (err instanceof ForbiddenException) {
        throw err;
      }

      throw new UnauthorizedException(
        err.message || 'Token inválido ou expirado',
      );
    }
  }
}
