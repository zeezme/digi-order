import { z } from 'zod';
import { KitchenItemStatus } from '../entities/kitchen-item.entity';

const kitchenItemStatusSchema = z.enum(
  Object.values(KitchenItemStatus) as [
    KitchenItemStatus,
    ...KitchenItemStatus[],
  ],
);

export const KitchenItemCreatedSchema = z.object({
  itemId: z.number().int().positive(),
  orderId: z.number().int().positive(),
  menuItemId: z.number().int().positive(),
  companyId: z.number().int().positive(),
  status: kitchenItemStatusSchema, // Deve ser PENDING
  createdAt: z.date(),
});
export type KitchenItemCreatedEvent = z.infer<typeof KitchenItemCreatedSchema>;

export const KitchenItemUpdatedSchema = z.object({
  itemId: z.number().int().positive(),
  orderId: z.number().int().positive(),
  companyId: z.number().int().positive(),
  oldStatus: kitchenItemStatusSchema,
  newStatus: kitchenItemStatusSchema,
  updatedAt: z.date(),
});
export type KitchenItemUpdatedEvent = z.infer<typeof KitchenItemUpdatedSchema>;
