import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { RoleRepository, UserRoleRepository } from '../permission.repository';
import { RoleType } from '../entities/role.entity';

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
    return this.roleRepository.createEntity(data);
  }

  async findAllRoles() {
    return this.roleRepository.findAllEntities();
  }

  async findRoleByName(name: RoleType) {
    return this.roleRepository.findByName(name);
  }

  async assignRole(userId: string, companyId: number, roleId: number) {
    const exists = await this.userRoleRepository.hasRole(
      userId,
      companyId,
      roleId,
    );
    if (exists) {
      throw new ConflictException('User already has this role in this company');
    }
    return this.userRoleRepository.createEntity({ userId, companyId, roleId });
  }

  async removeRole(userId: string, companyId: number, roleId: number) {
    const userRole = await this.userRoleRepository.findUserRole(
      userId,
      companyId,
      roleId,
    );
    if (!userRole) {
      throw new NotFoundException('User role not found');
    }
    await this.userRoleRepository.deleteEntity(userRole);
  }

  async getUserRoles(userId: string, companyId: number) {
    return this.userRoleRepository.findByUserAndCompany(userId, companyId);
  }

  async hasRole(
    userId: string,
    companyId: number,
    roleId: number,
  ): Promise<boolean> {
    return this.userRoleRepository.hasRole(userId, companyId, roleId);
  }

  async getUserPermissions(
    userId: string,
    companyId: number,
  ): Promise<string[]> {
    const userRoles = await this.getUserRoles(userId, companyId);
    const roleIds = userRoles.map((ur) => ur.roleId);

    const roles = await this.roleRepository.findAllEntities({
      id: { $in: roleIds },
    });

    const permissions = new Set<string>();
    roles.forEach((role) => {
      role.permissions?.forEach((p) => permissions.add(p));
    });

    return Array.from(permissions);
  }
}
