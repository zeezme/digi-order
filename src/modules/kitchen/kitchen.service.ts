// src/kitchen/kitchen-item.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { KitchenItemRepository } from './kitchen.repository';
import { KitchenItemStatus } from './entities/kitchen-item.entity';

@Injectable()
export class KitchenService {
  constructor(private readonly kitchenItemRepository: KitchenItemRepository) {}

  async create(orderId: number, menuItemId: number) {
    return this.kitchenItemRepository.createEntity({
      orderId,
      menuItemId,
      status: KitchenItemStatus.PENDING,
    });
  }

  async findAll() {
    return this.kitchenItemRepository.findAllEntities();
  }

  async findOne(id: number) {
    const item = await this.kitchenItemRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Kitchen item with ID ${id} not found`);
    }
    return item;
  }

  async findByOrderId(orderId: number) {
    return this.kitchenItemRepository.findByOrderId(orderId);
  }

  async findByStatus(status: KitchenItemStatus) {
    return this.kitchenItemRepository.findByStatus(status);
  }

  async updateStatus(id: number, status: KitchenItemStatus) {
    return this.kitchenItemRepository.updateStatus(id, status);
  }

  async remove(id: number) {
    const deleted = await this.kitchenItemRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`Kitchen item with ID ${id} not found`);
    }
  }

  async getPendingCount() {
    return this.kitchenItemRepository.countByStatus(KitchenItemStatus.PENDING);
  }
}
