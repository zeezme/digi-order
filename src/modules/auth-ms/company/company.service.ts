import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from './company.repository';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async create(data: { name: string; slug: string }) {
    return this.companyRepository.createEntity({ data });
  }

  async findAll() {
    return this.companyRepository.findAllEntities({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findById({ id });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async findBySlug(slug: string) {
    const company = await this.companyRepository.findBySlug(slug);
    if (!company) {
      throw new NotFoundException(`Company with slug ${slug} not found`);
    }
    return company;
  }

  async findActiveCompanies() {
    return this.companyRepository.findActiveCompanies();
  }

  async update(
    id: number,
    data: Partial<{ name: string; slug: string; isActive: boolean }>,
  ) {
    const company = await this.findOne(id);
    return this.companyRepository.updateEntity({ entity: company, data });
  }

  async remove(id: number) {
    const deleted = await this.companyRepository.deleteById({ id });
    if (!deleted) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }
}
