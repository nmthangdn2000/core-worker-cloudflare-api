import { z } from "zod";

export const variantLabelCreateSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.number(),
  userId: z.string().uuid(),
});

export type TVariantLabelCreateSchema = z.infer<
  typeof variantLabelCreateSchema
>;
