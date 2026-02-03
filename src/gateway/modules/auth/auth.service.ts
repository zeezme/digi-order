import { Injectable } from '@nestjs/common';
import { CompanyService } from '@src/modules/auth-ms/company/company.service';
import { CredentialService } from '@src/modules/auth-ms/credential/credential.service';
import { PermissionService } from '@src/modules/auth-ms/permission/services/permission.service';
import { UserService } from '@src/modules/auth-ms/user/user.service';
@Injectable()
export class AuthGatewayService {
  constructor(
    private readonly userService: UserService,
    private readonly credentialService: CredentialService,
    private readonly companyService: CompanyService,
    private readonly permissionService: PermissionService,
  ) {}
}
