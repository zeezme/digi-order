import { Injectable, NotFoundException } from '@nestjs/common';
import { KitchenItemRepository } from './kitchen.repository';
import { KitchenItemStatus } from './entities/kitchen-item.entity';

@Injectable()
export class KitchenService {
  constructor(private readonly kitchenItemRepository: KitchenItemRepository) {}

  async create(orderId: number, menuItemId: number, companyId: number) {
    return this.kitchenItemRepository.createEntity({
      order: orderId,
      menuItem: menuItemId,
      status: KitchenItemStatus.PENDING,
      companyId,
    });
  }

  async findAllByCompany(companyId: number) {
    return this.kitchenItemRepository.findAllByCompany(companyId);
  }

  async findOneByCompany(id: number, companyId: number) {
    const item = await this.kitchenItemRepository.findOneByIdAndCompany(
      id,
      companyId,
    );
    if (!item) {
      throw new NotFoundException(`Kitchen item with ID ${id} not found`);
    }
    return item;
  }

  async findByOrderIdAndCompany(orderId: number, companyId: number) {
    return this.kitchenItemRepository.findByOrderIdAndCompany(
      orderId,
      companyId,
    );
  }

  async findByStatusAndCompany(status: KitchenItemStatus, companyId: number) {
    return this.kitchenItemRepository.findByStatusAndCompany(status, companyId);
  }

  async updateStatus(
    itemId: number,
    status: KitchenItemStatus,
    companyId: number,
  ) {
    const updated = await this.kitchenItemRepository.updateStatusWithCompany(
      itemId,
      status,
      companyId,
    );
    if (!updated) {
      throw new NotFoundException(`Kitchen item with ID ${itemId} not found`);
    }
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
  }
}
