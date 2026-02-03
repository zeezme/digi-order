import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RoleRepository, UserRoleRepository } from '../permission.repository';
import { Role, RoleType } from '../entities/role.entity';
import { User } from '../../user/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Injectable()
export class PermissionService {
  constructor(
    public readonly roleRepository: RoleRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async createRole(data: {
    name: RoleType;
    description?: string;
    permissions?: string[];
  }) {
    return this.roleRepository.createEntity({
      data,
    });
  }

  async findAllRoles() {
    return this.roleRepository.findAllEntities();
  }

  async findRoleByName(name: RoleType) {
    return this.roleRepository.findByName(name);
  }

  async assignRole(userId: number, companyId: number, roleId: number) {
    const exists = await this.userRoleRepository.hasRole(
      userId,
      companyId,
      roleId,
    );

    if (exists) {
      throw new ConflictException('User already has this role in this company');
    }

    return this.userRoleRepository.createEntity({
      data: {
        user: this.userRoleRepository.connect(User, userId),
        company: this.userRoleRepository.connect(Company, companyId),
        role: this.userRoleRepository.connect(Role, roleId),
      },
    });
  }

  async removeRole(userId: number, companyId: number, roleId: number) {
    const userRole = await this.userRoleRepository.findUserRole(
      userId,
      companyId,
      roleId,
    );
    if (!userRole) {
      throw new NotFoundException('User role not found');
    }
    await this.userRoleRepository.deleteEntity({ entity: userRole });
  }

  async getUserRoles(userId: number, companyId: number) {
    return this.userRoleRepository.findByUserAndCompany(userId, companyId);
  }

  async hasRole(
    userId: number,
    companyId: number,
    roleId: number,
  ): Promise<boolean> {
    return this.userRoleRepository.hasRole(userId, companyId, roleId);
  }

  async getUserPermissions(
    userId: number,
    companyId: number,
  ): Promise<string[]> {
    const userRoles = await this.userRoleRepository.findByUserAndCompany(
      userId,
      companyId,
    );

    if (userRoles.length === 0) return [];

    const roleIds = userRoles.map((ur) => ur.role.id);

    const roles = await this.roleRepository.findAllEntities({
      where: { id: { $in: roleIds } },
      populate: ['permissionEntities'],
    });

    const permissions = new Set<string>();
    for (const role of roles) {
      for (const perm of role.permissionEntities.getItems()) {
        permissions.add(perm.key);
      }
    }

    return Array.from(permissions);
  }
}
