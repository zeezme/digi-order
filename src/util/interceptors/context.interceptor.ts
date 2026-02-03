import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  userId?: number | string;
  companyId?: number;
}

// Criar AsyncLocalStorage global
export const requestContext = new AsyncLocalStorage<RequestContext>();

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return requestContext.run(
      {
        userId: req.user?.id,
        companyId: req.company?.id,
      },
      () => next.handle(),
    );
  }
}

export function getRequestContext(): RequestContext {
  return requestContext.getStore() ?? {};
}
