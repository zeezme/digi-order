import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Company } from '@src/modules/auth-ms/company/entities/company.entity';
import { Request } from 'express';

/**
 * ### Custom NestJS parameter decorator that extracts the current `Company`
 * ### object from the incoming HTTP request.
 *---
 * This decorator assumes that the authentication guard or middleware
 * has already validated the request and attached the company to
 * `request.company`.
 *
 * ---
 * @example
 * ```ts
 * @Get('settings')
 * getCompanySettings(@CurrentCompany() company: Company) {
 *   return company;
 * }
 * ```
 *
 * @param _data - Optional metadata passed to the decorator (unused in this case)
 * @param context - The current `ExecutionContext`, used to access the underlying request
 *
 * @returns The current `Company` object, or `null` if no company is found
 */
export const CurrentCompany = createParamDecorator<Company | null>(
  (_data: unknown, context: ExecutionContext): Company | null => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.company ?? null;
  },
);
