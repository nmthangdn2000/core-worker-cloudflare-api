import { z } from "zod";
import { paginationSchema } from "../../../core/base/pagination.base";

export const variantLabelFilterSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export type TVariantLabelFilterSchema = z.infer<
  typeof variantLabelFilterSchema
>;
