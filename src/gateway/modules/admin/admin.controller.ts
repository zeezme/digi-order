import { Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, createUserSchema } from './admin.schema';
import { AdminGatewayService } from './admin.service';
import { CurrentUser } from '@src/util/decorators/current-user.decorator';
import { CurrentCompany } from '@src/util/decorators/current-company.decorators';
import { AuthUser } from '@src/util/types/express';
import { Company } from '@src/modules/auth-ms/company/entities/company.entity';
import { ZodValidated } from '@src/util/decorators/zod-validated.decorator';
import { JwtAuthGuard } from '@src/util/guards/jwt-auth.guard';
import { PermissionGuard } from '@src/util/guards/permission.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AdminGatewayController {
  constructor(private readonly authService: AdminGatewayService) {}

  @Post('user')
  createUser(
    @ZodValidated(createUserSchema) dto: CreateUserDto,
    @CurrentUser() user: AuthUser,
    @CurrentCompany() company: Company,
  ) {
    return this.authService.createUser({
      dto,
      currentUser: user,
      currentCompany: company,
    });
  }
}
