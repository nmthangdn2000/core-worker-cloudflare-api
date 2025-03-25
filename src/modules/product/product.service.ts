import { Prisma } from "@prisma/client";
import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TProductCreateSchema } from "./schema/product-create.schema";
import { TProductFilterSchema } from "./schema/product-get.schema";
import { TProductUpdateSchema } from "./schema/product-update.schema";
import { PaginationResponse } from "../../core/base/pagination.base";
import { STATUS_PRODUCT } from "./product.type";
import { stringToSlug } from "../../utils/util";

class ProductService {
  async statistic() {
    const topProducts = await prismaClient().orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const productIds = topProducts.map((item) => item.productId);

    const products = await prismaClient().product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const result = topProducts.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: product!.id,
        name: product!.name,
        slug: product!.slug,
        totalQuantity: item._sum.quantity,
      };
    });

    return result;
  }

  async getOne(slug: string) {
    const product = await prismaClient().product.findFirst({
      where: { slug },
      include: {
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        productImages: {
          select: {
            fileId: true,
            sortOrder: true,
            file: {
              select: {
                id: true,
                url: true,
                type: true,
                size: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    return this.formatProduct(product);
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
        include: {
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          productImages: {
            select: {
              fileId: true,
              sortOrder: true,
              file: {
                select: {
                  id: true,
                  url: true,
                  type: true,
                  size: true,
                },
              },
            },
          },
        },
        skip: (query.page - 1) * query.take,
        take: query.take,
        orderBy,
      }),
      prismaClient().product.count({
        where,
      }),
    ]);

    return new PaginationResponse({
      items: products.map(this.formatProduct),
      take: query.take,
      page: query.page,
      totalItems,
    });
  }

  async create(input: TProductCreateSchema) {
    const productExist = await prismaClient().product.findFirst({
      where: { slug: stringToSlug(input.name) },
    });

    if (productExist) {
      throw new BadRequestException(ERROR_MESSAGES.ProductExist);
    }

    // 2. Tạo Product
    const product = await prismaClient().product.create({
      data: {
        name: input.name,
        slug: stringToSlug(input.name),
        sku: input.sku ?? null,
        keywords: input.keywords,
        description: input.description,
        price: input.price,
        discount: input.discount ?? 0,
        stock: input.stock,
        status: input.status || STATUS_PRODUCT.DRAFT,
        variants: input.variants ? JSON.stringify(input.variants) : null,
        variantGroup: input.variantGroup
          ? JSON.stringify(input.variantGroup)
          : null,
      },
    });

    // 3. Gán hình ảnh
    if (input.productImages && input.productImages.length > 0) {
      await Promise.all(
        input.productImages.map((productImage, index) =>
          prismaClient().productImage.create({
            data: {
              productId: product.id,
              fileId: productImage.fileId,
              sortOrder: productImage.sortOrder ?? index,
            },
          })
        )
      );
    }

    // 4. Gán categories
    await Promise.all(
      input.categoryIds.map((categoryId) =>
        prismaClient().productOnCategory.create({
          data: {
            productId: product.id,
            categoryId,
          },
        })
      )
    );

    return this.getOne(product.slug);
  }

  async update(slug: string, input: TProductUpdateSchema) {
    const productExist = await prismaClient().product.findFirst({
      where: { slug },
      include: {
        categories: true,
      },
    });

    if (!productExist) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    // 2. Update product chính
    const product = await prismaClient().product.update({
      where: { id: productExist.id },
      data: {
        name: input.name,
        slug: stringToSlug(input.name),
        sku: input.sku ?? null,
        keywords: input.keywords,
        description: input.description,
        price: input.price,
        discount: input.discount ?? 0,
        stock: input.stock,
        status: input.status || STATUS_PRODUCT.DRAFT,
        variants: input.variants ? JSON.stringify(input.variants) : null,
        variantGroup: input.variantGroup
          ? JSON.stringify(input.variantGroup)
          : null,
      },
    });

    // 3. Xoá và thêm lại hình ảnh productIma
    await prismaClient().productImage.deleteMany({
      where: { productId: product.id },
    });
    if (input.productImages && input.productImages.length > 0) {
      await Promise.all(
        input.productImages.map((productImage, index) =>
          prismaClient().productImage.create({
            data: {
              productId: product.id,
              fileId: productImage.fileId,
              sortOrder: productImage.sortOrder ?? index,
            },
          })
        )
      );
    }

    // 4. Xoá và thêm lại categories
    await prismaClient().productOnCategory.deleteMany({
      where: { productId: product.id },
    });
    await Promise.all(
      input.categoryIds.map((categoryId) =>
        prismaClient().productOnCategory.create({
          data: {
            productId: product.id,
            categoryId,
          },
        })
      )
    );

    return this.getOne(product.slug);
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

  private formatProduct(product: Prisma.ProductGetPayload<any>) {
    return {
      ...product,
      variants: product.variants ? JSON.parse(product.variants) : [],
      variantGroup: product.variantGroup
        ? JSON.parse(product.variantGroup)
        : [],
      categories: (product as any).categories.map((item: any) => item.category),
      productImages: (product as any).productImages
        ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
        .map((item: any) => item.file),
    };
  }
}

export default new ProductService();
