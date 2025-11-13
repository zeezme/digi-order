import { UserProfile } from '../identity/user-profile.contract';
import { UserIdentityQueryClient } from '../identity/user-identity.query-client';

type StitchedEntity<T> = T & { [key: string]: UserProfile | null };

export async function stitchUserProfiles<T>(
  items: T[],
  idFieldName: keyof T,
  targetFieldName: string,
  queryClient: UserIdentityQueryClient,
): Promise<StitchedEntity<T>[]> {
  if (!items || items.length === 0) {
    return items as StitchedEntity<T>[];
  }

  const userIds: (number | string)[] = items
    .map((item) => item[idFieldName] as unknown as string | number)
    .filter((id) => id !== null && id !== undefined);

  const userProfilesMap = await queryClient.getProfilesMap(userIds);

  return items.map((item) => {
    const userId = item[idFieldName] as unknown as string | number;

    const profile = userProfilesMap.get(userId) || null;

    return {
      ...item,
      [targetFieldName]: profile,
    } as StitchedEntity<T>;
  });
}
