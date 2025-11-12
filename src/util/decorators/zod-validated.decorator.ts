import { applyDecorators, UsePipes, PipeTransform } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { ZodType } from 'zod';

export const ZodValidated = (schema: ZodType): MethodDecorator => {
  return applyDecorators(
    UsePipes(new ZodValidationPipe(schema) as unknown as PipeTransform),
  );
};
