import { Injectable, Logger } from '@nestjs/common';
import { UserProfile } from './user-profile.contract';
import { UserService } from '@src/modules/auth-ms/user/user.service';

@Injectable()
export class UserIdentityQueryClient {
  private readonly logger = new Logger(UserIdentityQueryClient.name);

  constructor(private readonly userService: UserService) {}

  async getProfilesMap(
    userIds: (number | string)[],
  ): Promise<Map<number | string, UserProfile>> {
    if (!userIds || userIds.length === 0) {
      return new Map();
    }

    const uniqueIds = [...new Set(userIds)];

    try {
      this.logger.debug(
        `[ACL] Fetching ${uniqueIds.length} profiles via internal service call.`,
      );

      const profiles = await this.userService.findBySupabaseIds(uniqueIds);

      const profileMap = new Map<number | string, UserProfile>();

      profiles.forEach((p) => {
        if (p.id !== undefined && p.id !== null) {
          const profile: UserProfile = {
            id: p.id,
            name: p.name || '',
            companyId: p.companyId || 0,
          };

          profileMap.set(p.id, profile);
        }
      });

      return profileMap;
    } catch (error: any) {
      this.logger.error(
        `[ACL Error] Failed to fetch user profiles internally: ${error.message}`,
      );
      return new Map();
    }
  }
}
