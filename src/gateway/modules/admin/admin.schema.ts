import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string(),
  password: z.string().min(8),
  companyId: z.number(),
  roleId: z.number(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
