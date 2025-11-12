import { applyDecorators, UsePipes, PipeTransform } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ZodType } from 'zod';

/**
 * @decorator ZodValidated
 * @description
 * ### A method-level decorator that automatically applies a `ZodValidationPipe`
 * ### to validate incoming request data against a given Zod schema.
 *
 * This decorator simplifies request validation by allowing you to attach a schema
 * directly to controller methods instead of manually configuring `UsePipes` each time.
 *
 * It is typically used together with DTOs inferred from Zod schemas.
 *
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { ZodValidated } from '@src/util/decorators/zod-validated.decorator';
 *
 * const createUserSchema = z.object({
 *   name: z.string(),
 *   email: z.string().email(),
 * });
 *
 * @Post('users')
 * @ZodValidated(createUserSchema)
 * createUser(@Body() dto: z.infer<typeof createUserSchema>) {
 *   return this.userService.create(dto);
 * }
 * ```
 *
 * @param schema - The Zod schema used for request body validation.
 *
 * @returns A method decorator that applies the validation pipe to the route.
 */
export const ZodValidated = (schema: ZodType): MethodDecorator => {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema) as unknown as PipeTransform),
  );
};
