import { Body } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ZodType } from 'zod';

/**
 * @decorator ZodValidated
 * @description
 * Parameter decorator que aplica validação Zod diretamente no @Body().
 * Combina @Body() + ZodValidationPipe em um único decorator,
 * sem conflitar com outros parâmetros do método.
 *
 * @example
 * ```ts
 * @Post('users')
 * createUser(
 *   @ZodValidated(createUserSchema) dto: CreateUserDto,
 *   @CurrentUser() user: AuthUser,
 * ) {}
 * ```
 *
 * @param schema - The Zod schema used for request body validation.
 */
export const ZodValidated = (schema: ZodType): ParameterDecorator => {
  return Body(new ZodValidationPipe(schema));
};
