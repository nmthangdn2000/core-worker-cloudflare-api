import { z } from "zod";

export const cartUpdateSchema = z.object({
  quantity: z.number(),
});

export type TCartUpdateSchema = z.infer<typeof cartUpdateSchema>;
