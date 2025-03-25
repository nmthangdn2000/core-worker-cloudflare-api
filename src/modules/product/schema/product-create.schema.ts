import { z } from "zod";
import { TVariant } from "../product.type";

export const productImageSchema = z.object({
  fileId: z.string().uuid(),
  sortOrder: z.number(),
});

export const variantOptionSchema = z.object({
  name: z.string(), // Tên option (Đỏ, Xanh,...)
});

export const variantLabelSchema = z.object({
  name: z.string(), // Tên group thuộc tính (Màu sắc, Kích cỡ,...)
  variantOptions: z.array(variantOptionSchema),
});

export const variantSchema: z.ZodType<TVariant> = z.lazy(() =>
  z.object({
    variantOption: z.string(),
    children: z.array(variantSchema).optional(),
    price: z.number().min(0, "Giá không hợp lệ").optional(),
    discount: z.number().min(0).max(100).optional(),
    stock: z.number().int().min(0, "Số lượng không hợp lệ").optional(),
    fileId: z.string().uuid().optional(),
  })
);

export const productCreateSchema = z.object({
  name: z.string(),
  sku: z.string().nullable().optional(),
  keywords: z.string(),
  description: z.string().nullable().optional(),
  price: z.number(),
  discount: z.number().optional(),
  categoryIds: z.array(z.string().uuid()), // nếu backend nhận qua Id
  stock: z.number(),
  productImages: z.array(productImageSchema).optional(),
  variants: z.array(variantLabelSchema).optional(),
  variantGroup: z.array(variantSchema).optional(),
  status: z.string(), // ✅ bổ sung field status
});

export type TProductCreateSchema = z.infer<typeof productCreateSchema>;
