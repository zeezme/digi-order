import { Injectable, NotFoundException } from '@nestjs/common';
import { KafkaProducerService } from '@src/util/kafka/kafka-producer.service';
import { KitchenItemRepository } from '../kitchen.repository';
import { KitchenItemStatus } from '../entities/kitchen-item.entity';
import {
  KitchenItemCreatedEvent,
  KitchenItemCreatedSchema,
  KitchenItemUpdatedEvent,
  KitchenItemUpdatedSchema,
} from '../kafka/kitchen-events.schema';

@Injectable()
export class KitchenWriteService {
  constructor(
    private readonly kitchenItemRepository: KitchenItemRepository,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  /**
   * Cria um novo item de cozinha e emite o evento 'kitchen.item.created'.
   * @emits Kafka Event: 'kitchen.item.created'
   * @payload KitchenItemCreatedEvent
   */
  async create({
    orderId,
    menuItemId,
    companyId,
  }: {
    orderId: number;
    menuItemId: number;
    companyId: number;
  }) {
    const newItem = await this.kitchenItemRepository.createEntity({
      data: {
        order: orderId,
        menuItem: menuItemId,
        status: KitchenItemStatus.PENDING,
        companyId,
      },
    });

    const payload: KitchenItemCreatedEvent = KitchenItemCreatedSchema.parse({
      itemId: newItem.id,
      orderId: newItem.order?.id || orderId,
      menuItemId: newItem.menuItem?.id || menuItemId,
      companyId: companyId,
      status: newItem.status,
      createdAt: newItem.createdAt,
    });

    await this.kafkaProducer.emit(
      'kitchen.item.created',
      newItem.id.toString(),
      payload,
    );

    return newItem;
  }

  /**
   * Atualiza o status de um item de cozinha e emite o evento 'kitchen.item.status.updated'.
   * @emits Kafka Event: 'kitchen.item.status.updated'
   * @payload KitchenItemUpdatedEvent
   */
  async updateStatus(
    itemId: number,
    status: KitchenItemStatus,
    companyId: number,
  ) {
    const item = await this.kitchenItemRepository.findOneByIdAndCompany(
      itemId,
      companyId,
    );

    if (!item) {
      throw new NotFoundException(`Kitchen item with ID ${itemId} not found`);
    }

    const oldStatus = item.status;

    const updated = await this.kitchenItemRepository.updateStatusWithCompany(
      itemId,
      status,
      companyId,
    );

    if (!updated) {
      throw new NotFoundException(`Kitchen item with ID ${itemId} not found`);
    }

    const payload: KitchenItemUpdatedEvent = KitchenItemUpdatedSchema.parse({
      itemId: updated.id,
      orderId: updated.order.id,
      companyId: companyId,
      oldStatus: oldStatus,
      newStatus: updated.status,
      updatedAt: updated.updatedAt,
    });

    await this.kafkaProducer.emit(
      'kitchen.item.status.updated',
      updated.id.toString(),
      payload,
    );

    return updated;
  }

  async remove(itemId: number, companyId: number) {
    const deleted = await this.kitchenItemRepository.deleteByIdAndCompany(
      itemId,
      companyId,
    );

    if (!deleted) {
      throw new NotFoundException(`Kitchen item with ID ${itemId} not found`);
    }

    const payload = {
      itemId,
      companyId,
      deletedAt: new Date(),
    };

    await this.kafkaProducer.emit(
      'kitchen.item.deleted',
      itemId.toString(),
      payload,
    );
  }
}
