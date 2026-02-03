import { Injectable, NestMiddleware } from '@nestjs/common';
import { requestContext } from '../context/request-context';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    requestContext.run(
      {
        userId: req.user?.id,
        companyId: req.company?.id,
      },
      () => next(),
    );
  }
}
