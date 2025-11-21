import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '@src/util/supabase/supabase.service';
import { CompanyService } from '@src/modules/auth-ms/company/company.service';
import { UserService } from '@src/modules/auth-ms/user/user.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token: string = authHeader.replace('Bearer ', '').trim();

    try {
      const user = await this.supabaseService.validateToken(token);

      const localUser = await this.userService.findBySupabaseId(user.id);

      if (!localUser) {
        throw new UnauthorizedException(
          'Usuário não encontrado no sistema, por favor entrar em contato com o suporte',
        );
      }

      const company = await this.companyService.findOne(localUser.companyId);

      if (!company) {
        throw new UnauthorizedException(
          'Usuário ainda não configurado, por favor entrar em contato com o suporte',
        );
      }

      if (!company) {
        throw new ForbiddenException(`Company not found or inactive.`);
      }

      request.user = user;
      request.company = company;

      request.companyId = company.id;

      return true;
    } catch (err: any) {
      if (err instanceof ForbiddenException) {
        throw err;
      }
      throw new UnauthorizedException(err.message || 'Unauthorized');
    }
  }
}
