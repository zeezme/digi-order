import { Body, Controller, Post } from '@nestjs/common';
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
  login(@Body() @ZodValidated(loginSchema) dto: LoginDto) {
    return this.credentialService.login(dto);
  }
}
