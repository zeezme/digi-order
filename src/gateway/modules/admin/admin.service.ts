import { ForbiddenException, Injectable } from '@nestjs/common';
import { CompanyService } from '@src/modules/auth-ms/company/company.service';
import { CredentialService } from '@src/modules/auth-ms/credential/credential.service';
import { PermissionService } from '@src/modules/auth-ms/permission/services/permission.service';
import { UserService } from '@src/modules/auth-ms/user/user.service';
import { CreateUserDto } from './admin.schema';
import { AuthUser } from '@src/util/types/express';
import { Company } from '@src/modules/auth-ms/company/entities/company.entity';
@Injectable()
export class AdminGatewayService {
  constructor(
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
    private readonly companyService: CompanyService,
    private readonly permissionService: PermissionService,
  ) {}

  async createUser({
    dto,
  }: {
    dto: CreateUserDto;
    currentUser: AuthUser;
    currentCompany: Company;
  }) {
    const company = await this.companyService.findOne(dto.companyId);

    if (!company) throw new ForbiddenException('Company not found');

    const user = await this.userService.create({
      email: dto.email,
      name: dto.name,
      companyId: company.id,
    });

    await this.credentialService.createPassword(user, dto.password);

    const permissionEntity = await this.permissionService.assignRole(
      user.id,
      company.id,
      dto.roleId,
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      companyId: company.id,
      role: permissionEntity.role.name,
    };
  }
}
