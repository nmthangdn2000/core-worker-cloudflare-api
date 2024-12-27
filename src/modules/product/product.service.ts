import { Prisma } from "@prisma/client";
import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TProductCreateSchema } from "./schema/product-create.schema";
import { TProductFilterSchema } from "./schema/product-get.schema";
import { TProductUpdateSchema } from "./schema/product-update.schema";
import { PaginationResponse } from "../../core/base/pagination.base";

class ProductService {
  async getOne(id: string) {
    const product = await prismaClient().product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    return product;
  }

  async getAll(query: TProductFilterSchema) {
    const where: Prisma.ProductWhereInput = {};

    if (query.q) {
      where.OR = [
        {
          name: {
            contains: query.q,
          },
        },
        {
          keywords: {
            contains: query.q,
          },
        },
      ];
    }

    if (query.categoryIds && query.categoryIds.length > 0) {
      where.categories = {
        some: {
          categoryId: {
            in: query.categoryIds,
          },
        },
      };
    }

    if (query.startPrice) {
      where.price = {
        gte: query.startPrice,
      };
    }

    if (query.endPrice) {
      where.price = {
        lte: query.endPrice,
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (query.sortKey) {
      orderBy[query.sortKey] = query.sortOrder || "asc";
    }

    const [products, totalItems] = await Promise.all([
      prismaClient().product.findMany({
        where,
        skip: (query.page - 1) * query.take,
        take: query.take,
        orderBy,
      }),
      prismaClient().product.count({
        where,
      }),
    ]);

    return new PaginationResponse({
      items: products,
      take: query.take,
      page: query.page,
      totalItems,
    });
  }

  async create(input: TProductCreateSchema) {
    const product = await prismaClient().product.create({
      data: {
        ...input,
        specifications: JSON.stringify(input.specifications),
        images: JSON.stringify(input.images),
      },
    });

    await prismaClient().product.update({
      where: {
        id: product.id,
      },
      data: {
        categories:
          input.categoryIds && input.categoryIds.length > 0
            ? {
                connect: input.categoryIds.map((categoryId) => ({
                  categoryId_productId: {
                    categoryId,
                    productId: product.id,
                  },
                })),
              }
            : {},
      },
    });

    return product;
  }

  async update(id: string, input: TProductUpdateSchema) {
    const productExist = await prismaClient().product.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    if (input.specifications) {
      input.specifications = JSON.stringify(input.specifications) as any;
    }

    if (input.images) {
      input.images = JSON.stringify(input.images) as any;
    }

    const product = await prismaClient().product.update({
      where: {
        id,
      },
      data: {
        categories:
          input.categoryIds && input.categoryIds.length > 0
            ? {
                connect: input.categoryIds.map((categoryId) => ({
                  categoryId_productId: {
                    categoryId,
                    productId: id,
                  },
                })),
              }
            : {},
      },
    });

    return product;
  }

  async delete(id: string) {
    const productExist = await prismaClient().product.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    await prismaClient().product.delete({
      where: {
        id,
      },
    });

    return {
      message: "Delete product successfully",
    };
  }
}

export default new ProductService();
