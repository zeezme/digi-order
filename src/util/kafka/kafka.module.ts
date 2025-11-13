import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaProducerService } from './kafka-producer.service';
import kafkaConfig from '@src/util/kafka/kafka.config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [kafkaConfig],
      isGlobal: true,
    }),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
