import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: {
    email: string;
    name: string;
    companyId: number;
    phone?: string;
    avatarUrl?: string;
  }) {
    const exists = await this.userRepository.existsByEmail(data.email);

    if (exists) {
      throw new ConflictException('User already exists');
    }

    return this.userRepository.createEntity({ data });
  }

  async findByEmail(email: string, companyId: number) {
    return this.userRepository.findByEmail(email, companyId);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findById({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findManyByIds(ids: (number | string)[]) {
    return this.userRepository.findAll({
      filters: { id: { $in: ids } },
    });
  }

  async findActiveByCompany(companyId: number) {
    return this.userRepository.findActiveUsersByCompany(companyId);
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      phone: string;
      avatarUrl: string;
      isActive: boolean;
    }>,
  ) {
    const user = await this.findOne(id);
    return this.userRepository.updateEntity({ entity: user, data });
  }

  async remove(id: number) {
    const deleted = await this.userRepository.deleteById({ id });
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
