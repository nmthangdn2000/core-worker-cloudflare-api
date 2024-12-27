import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().optional().default(1),
  take: z.number().optional().default(10),
  sortKey: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export class PaginationResponse<T> {
  constructor({
    items,
    take,
    page,
    totalItems,
  }: {
    items: T[];
    take: number;
    page: number;
    totalItems: number;
  }) {
    return {
      items,
      meta: {
        page,
        take: take,
        totalItems,
        totalPages: Math.ceil(totalItems / take),
        itemCount: items.length,
      },
    };
  }
}
