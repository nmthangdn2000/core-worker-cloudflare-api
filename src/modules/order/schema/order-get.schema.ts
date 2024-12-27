import { z } from "zod";
import { paginationSchema } from "../../../core/base/pagination.base";
import { SORT_KEY_ORDER } from "../order.type";

export const orderFilterSchema = paginationSchema.extend({
  userId: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortKey: z.nativeEnum(SORT_KEY_ORDER).optional(),
});

export type TOrderFilterSchema = z.infer<typeof orderFilterSchema>;
