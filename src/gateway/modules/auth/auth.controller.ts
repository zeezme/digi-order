import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGatewayService } from './auth.service';
import { ZodValidated } from '@src/util/decorators/zod-validated.decorator';
import { CredentialService } from '../../../modules/auth-ms/credential/credential.service';
import { LoginDto, loginSchema } from './auth.schema';

@Controller('auth')
export class AuthGatewayController {
  constructor(
    private readonly authService: AuthGatewayService,
    private readonly credentialService: CredentialService,
  ) {}

  @Post('login')
  async login(
    @Body() @ZodValidated(loginSchema) dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const isProd = process.env.NODE_ENV === 'production';

    const data = await this.credentialService.login(dto);

    response.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: data.accessToken,
      user: data.user,
      permissions: data.permissions,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken: string = (request as any).cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const tokens = await this.credentialService.refresh(refreshToken);

    const isProd = process.env.NODE_ENV === 'production';

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: tokens.accessToken,
    };
  }
}
