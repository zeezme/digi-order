import { Company } from '@src/modules/company/entities/company.entity';
import { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      company?: Company;
    }
  }
}
