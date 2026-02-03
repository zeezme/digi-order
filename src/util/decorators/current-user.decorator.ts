import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser } from '../types/express';

/**
 * ### Custom NestJS parameter decorator that extracts the authenticated Supabase `User`
 * ### object from the incoming HTTP request.
 *---
 * This decorator assumes that the authentication guard (`SupabaseAuthGuard`)
 * has already validated the request and attached the authenticated user to
 * `request.user`.
 *
 *---
 * @example
 * ```ts
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 *
 * @param _data - Optional metadata passed to the decorator (unused in this case)
 * @param context - The current `ExecutionContext`, used to access the underlying request
 *
 * @returns The authenticated `User` object from Supabase, or `null` if no user is found
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUser | null => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user ?? null;
  },
);
