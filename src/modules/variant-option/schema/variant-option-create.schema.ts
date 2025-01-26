import { z } from "zod";

export const variantOptionCreateSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.number(),
  userId: z.string().uuid(),
});

export type TVariantOptionCreateSchema = z.infer<
  typeof variantOptionCreateSchema
>;
