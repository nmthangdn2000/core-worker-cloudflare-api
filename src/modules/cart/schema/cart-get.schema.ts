import { z } from "zod";
import { paginationSchema } from "../../../core/base/pagination.base";

export const cartFilterSchema = paginationSchema.extend({
  userId: z.string().optional(),
});

export type TCartFilterSchema = z.infer<typeof cartFilterSchema>;
