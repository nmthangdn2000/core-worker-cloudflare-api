import { z } from "zod";

const specifications = z.object({
  color: z.string(),
  size: z.string(),
  weight: z.number(),
  material: z.string(),
  warranty: z.string(),
});

export const productCreateSchema = z.object({
  name: z.string(),
  keywords: z.string(),
  description: z.string(),
  specifications: z.any().optional(),
  price: z.number(),
  discount: z.number().optional(),
  images: z.array(z.string()),
  categoryIds: z.array(z.string().uuid()),
  stock: z.number(),
});

export type TProductCreateSchema = z.infer<typeof productCreateSchema>;
