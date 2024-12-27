import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string(),
});

export type TCategoryCreateSchema = z.infer<typeof categoryCreateSchema>;
