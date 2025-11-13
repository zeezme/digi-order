import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../gateway/auth/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token: string = authHeader.replace('Bearer ', '').trim();

    try {
      const user = await this.supabaseService.validateToken(token);

      const companyId = (user.user_metadata as any)?.companyId;

      if (!companyId) {
        throw new UnauthorizedException(
          'Usuário ainda não configurado, por favor entrar em contato com o suporte',
        );
      }

      request.user = user;
      request.companyId = companyId;

      return true;
    } catch (err: any) {
      throw new UnauthorizedException(err.message || 'Unauthorized');
    }
  }
}
