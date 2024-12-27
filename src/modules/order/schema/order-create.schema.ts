import { z } from "zod";

export const orderCreateSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
  note: z.string().optional(),
});

export type TOrderCreateSchema = z.infer<typeof orderCreateSchema>;
