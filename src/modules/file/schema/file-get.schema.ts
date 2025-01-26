import { z } from "zod";
import { paginationSchema } from "../../../core/base/pagination.base";

export const fileFilterSchema = paginationSchema.extend({
  name: z.string().optional(),
});

export type TFileFilterSchema = z.infer<typeof fileFilterSchema>;
