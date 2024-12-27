import { z } from "zod";
import { paginationSchema } from "../../../core/base/pagination.base";
import { SORT_KEY_PRODUCT } from "../product";

export const productFilterSchema = paginationSchema.extend({
  q: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  startPrice: z.coerce.number().optional(),
  endPrice: z.number().optional(),
  sortKey: z.nativeEnum(SORT_KEY_PRODUCT).optional(),
});

export type TProductFilterSchema = z.infer<typeof productFilterSchema>;
