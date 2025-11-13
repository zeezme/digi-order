import {
  Injectable,
  Logger,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, logLevel } from 'kafkajs';

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private readonly configService: ConfigService) {
    const kafkaConfig = this.configService.get('kafka');

    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      logLevel: logLevel.WARN,
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    this.logger.log('Connecting Kafka Producer...');

    await this.producer.connect();

    this.logger.log('Kafka Producer Connected.');
  }

  async onApplicationShutdown() {
    this.logger.log('Disconnecting Kafka Producer...');

    await this.producer.disconnect();

    this.logger.log('Kafka Producer Disconnected.');
  }

  async emit(topic: string, key: string, payload: any): Promise<void> {
    try {
      const value = JSON.stringify(payload);

      this.logger.debug(`Sending message to ${topic}. Key: ${key}`);

      await this.producer.send({
        topic,
        messages: [{ key, value }],
      });
    } catch (error: any) {
      this.logger.error(
        `[KAFKA SEND ERROR] Failed to emit event to topic ${topic}`,
        error.stack,
      );
    }
  }
}
