import { Module } from '@nestjs/common';
import { KitchenService } from './kitchen.service';

@Module({
  providers: [KitchenService],
})
export class KitchenModule {}
