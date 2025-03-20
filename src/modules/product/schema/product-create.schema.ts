import { z } from "zod";


export const variantOptionSchema = z.object({
  name: z.string(), // tên option (Đỏ, Xanh,...)
  fileId: z.string().uuid(), // file hình ảnh
  quantity: z.number(), // số lượng riêng của option
  price: z.number(), // giá riêng của option
  discount: z.number().optional(), // discount riêng option (nếu có)
});

export const variantLabelSchema = z.object({
  name: z.string(), // Tên group thuộc tính (Màu sắc, Kích cỡ,...)
  variantOptions: z.array(variantOptionSchema),
});

export const productCreateSchema = z.object({
  name: z.string(),
  sku: z.string().nullable().optional(),
  keywords: z.string(),
  description: z.string(),
  price: z.number(),
  discount: z.number().optional(),
  images: z.array(z.string()),
  categoryIds: z.array(z.string().uuid()),
  stock: z.number(),
  variantLabels: z.array(variantLabelSchema).optional(),
});

export type TProductCreateSchema = z.infer<typeof productCreateSchema>;
