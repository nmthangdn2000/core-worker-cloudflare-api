import { categoryCreateSchema } from "./category-create.schema";
import { z } from "zod";

export const categoryUpdateSchema = categoryCreateSchema;

export type TCategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>;
