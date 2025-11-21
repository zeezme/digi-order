import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: {
    supabaseId: string;
    email: string;
    name: string;
    companyId: number;
    phone?: string;
    avatarUrl?: string;
  }) {
    const exists = await this.userRepository.existsBySupabaseId(
      data.supabaseId,
    );
    if (exists) {
      throw new ConflictException('User already exists');
    }
    return this.userRepository.createEntity({ data });
  }

  async findBySupabaseId(supabaseId: string) {
    return this.userRepository.findBySupabaseId(supabaseId);
  }

  async findBySupabaseIds(ids: (number | string)[]): Promise<Partial<User>[]> {
    const users = await this.userRepository.findBySupabaseIds(ids);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      companyId: user.companyId,
    }));
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

  async getOrCreateFromSupabase(
    supabaseId: string,
    email: string,
    companyId: number,
    metadata?: { name?: string; phone?: string; avatarUrl?: string },
  ) {
    let user = await this.findBySupabaseId(supabaseId);

    if (!user) {
      user = await this.create({
        supabaseId,
        email,
        name: metadata?.name || email.split('@')[0],
        companyId,
        phone: metadata?.phone,
        avatarUrl: metadata?.avatarUrl,
      });
    }

    return user;
  }
}
