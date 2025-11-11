// src/common/pipes/zod-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodObject, ZodRawShape } from 'zod';

@Injectable()
export class ZodValidationPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(private schema: ZodObject<T>) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }

    return result.data;
  }
}
