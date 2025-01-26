import { z } from "zod";

export const fileCreateSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.number(),
  userId: z.string().uuid(),
});

export type TFileCreateSchema = z.infer<typeof fileCreateSchema>;
