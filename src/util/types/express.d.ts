import { Company } from '@src/modules/auth-ms/company/entities/company.entity';
import { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      company?: Company;
    }
  }
}
