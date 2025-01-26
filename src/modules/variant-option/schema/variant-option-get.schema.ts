import { z } from "zod";
import { paginationSchema } from "../../../core/base/pagination.base";

export const variantOptionFilterSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export type TVariantOptionFilterSchema = z.infer<
  typeof variantOptionFilterSchema
>;
