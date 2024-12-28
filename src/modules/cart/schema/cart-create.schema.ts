import { z } from "zod";

export const cartCreateSchema = z.object({
  product: z.string().uuid(),
  quantity: z.number(),
});

export type TCartCreateSchema = z.infer<typeof cartCreateSchema>;
