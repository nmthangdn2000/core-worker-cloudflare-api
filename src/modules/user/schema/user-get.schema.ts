import { paginationSchema } from "../../../core/base/pagination.base";
import { z } from "zod";

export const userFilterSchema = paginationSchema.extend({
  q: z.string().optional(),
});

export type TUserFilterSchema = z.infer<typeof userFilterSchema>;
