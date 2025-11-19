import { UserProfile } from '../identity/user-profile.contract';
import { UserIdentityQueryClient } from '../identity/user-identity.query-client';

type StitchedEntity<T> = T & { [key: string]: UserProfile | null };

/**
 * ### Stitches user profile data into an array of entities by injecting
 * ### a `UserProfile` (or `null`) into each item under a specified field name.
 *
 * ---
 * ### What this function does
 * - Accepts a list of items of type `T`.
 * - Extracts user IDs from each item using `idFieldName`.
 * - Fetches all corresponding user profiles in a single batch call via `queryClient`.
 * - Appends each fetched profile back onto the item under `targetFieldName`.
 *
 * ---
 * ### Why use this?
 * This pattern avoids the "N+1" problem by:
 * - **Batch querying** user profiles once,
 * - **Mapping** them efficiently back to each entity,
 * - **Extending** each entity with the stitched profile without mutation.
 *
 * ---
 * @typeParam T - The type of each entity in the input array.
 *
 * @param items - The list of entities to enrich with user profile data.
 * @param idFieldName - The name of the field in `T` that contains the user ID.
 * @param targetFieldName - The field name to add to each entity containing the stitched profile.
 * @param queryClient - A client capable of fetching user profiles in batch and returning a Map.
 *
 * @returns A new array where each entity contains an additional field,
 * named via `targetFieldName`, holding either a `UserProfile` or `null`.
 *
 * ---
 * @example
 * ```ts
 * // Suppose each comment has: { id, userId, content }
 *
 * const enrichedComments = await stitchUserProfiles(
 *   comments,
 *   'userId',
 *   'author',
 *   userIdentityClient,
 * );
 *
 * // Result:
 * // {
 * //   id: 1,
 * //   userId: 42,
 * //   content: 'Nice post!',
 * //   author: { id: 42, name: 'Alice', avatar: '...' }  // stitched profile
 * // }
 * ```
 */
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
