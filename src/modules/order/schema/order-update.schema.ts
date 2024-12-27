import { z } from "zod";

export const orderUpdateSchema = z.object({
  status: z.string().optional(),
  note: z.string().optional(),
  noteAdmin: z.string().optional(),
});

export type TOrderUpdateSchema = z.infer<typeof orderUpdateSchema>;
