import { productCreateSchema } from "./product-create.schema";
import { z } from "zod";

export const productUpdateSchema = productCreateSchema.partial();

export type TProductUpdateSchema = z.infer<typeof productUpdateSchema>;
