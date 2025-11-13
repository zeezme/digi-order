import { KitchenItemStatus } from '@src/modules/core_ms/kitchen/entities/kitchen-item.entity';
import { z } from 'zod';

const kitchenItemStatusSchema = z.enum(
  Object.values(KitchenItemStatus) as [
    KitchenItemStatus,
    ...KitchenItemStatus[],
  ],
);

export const createKitchenItemSchema = z.object({
  orderId: z.number(),
  menuItemId: z.number(),
  status: kitchenItemStatusSchema.optional(),
  notes: z.string().optional(),
  preparedBy: z.number().optional(),
});

export const updateKitchenItemSchema = createKitchenItemSchema.partial();

export const kitchenItemResponseSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  menuItemId: z.number(),
  status: kitchenItemStatusSchema,
  startedAt: z.date().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  estimatedCompletionTime: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  preparedBy: z.number().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
});

export type CreateKitchenItemDto = z.infer<typeof createKitchenItemSchema>;
export type UpdateKitchenItemDto = z.infer<typeof updateKitchenItemSchema>;
export type KitchenItemResponseDto = z.infer<typeof kitchenItemResponseSchema>;
