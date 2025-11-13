import { Injectable, NotFoundException } from '@nestjs/common';
import { KitchenItemRepository } from '../kitchen.repository';
import { KitchenItemStatus } from '../entities/kitchen-item.entity';

@Injectable()
export class KitchenReadService {
  constructor(private readonly kitchenItemRepository: KitchenItemRepository) {}

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
}
