import { Company } from '@src/modules/auth-ms/company/entities/company.entity';

export interface AuthUser {
  id: number;
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      company?: Company;
      cookies: { [key: string]: string };
      signedCookies: { [key: string]: string };
    }
  }
}
