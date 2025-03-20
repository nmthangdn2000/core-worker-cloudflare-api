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
        image: product!.images.split(","),
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
        VariantLabel: {
          include: {
            variantOptions: {
              include: {
                file: true, 
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
    const { categoryIds, variantLabels, images, ...rest } = input;
  
    // 1. Tạo product
    const product = await prismaClient().product.create({
      data: {
        ...rest,
        slug: stringToSlug(rest.name),
        status: STATUS_PRODUCT.IN_STOCK,
        specifications: rest.description ? JSON.stringify(rest.description) : undefined,
        images: images.join(","),
      },
    });
  
    // 2. Gán category
    if (categoryIds?.length) {
      await prismaClient().productOnCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          categoryId,
          productId: product.id,
        })),
      });
    }
  
    // 3. Tạo VariantLabel và VariantOption nếu có
    if (variantLabels && variantLabels.length > 0) {
      for (const label of variantLabels) {
        const createdLabel = await prismaClient().variantLabel.create({
          data: {
            name: label.name,
            productId: product.id,
          },
        });
  
        if (label.variantOptions?.length > 0) {
          await prismaClient().variantOption.createMany({
            data: label.variantOptions.map((option) => ({
              name: option.name,
              variantLabelId: createdLabel.id,
              fileId: option.fileId,
              quantity: option.quantity,
              price: option.price,
              discount: option.discount ?? 0,
            })),
          });
        }
      }
    }
  
    // 4. Lấy lại product kèm quan hệ
    return prismaClient().product.findUnique({
      where: { id: product.id },
      include: {
        categories: {
          include: { category: true },
        },
        VariantLabel: {
          include: {
            variantOptions: true,
          },
        },
      },
    });
  }
  
  

  async update(slug: string, input: TProductUpdateSchema) {
    const productExist = await prismaClient().product.findFirst({
      where: { slug },
    });
  
    if (!productExist) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }
  
    const { categoryIds, variantLabels, images, ...rest } = input;
  
    // Cập nhật product
    const updatedProduct = await prismaClient().product.update({
      where: { id: productExist.id },
      data: {
        ...rest,
        images: images && images.length > 0 ? images.join(",") : productExist.images,
        slug: rest.name ? stringToSlug(rest.name) : productExist.slug,
      },
    });
  
    // Xóa hết category cũ (nếu có categoryIds mới)
    if (categoryIds && categoryIds.length > 0) {
      await prismaClient().productOnCategory.deleteMany({
        where: { productId: productExist.id },
      });
  
      // Gán lại categories mới
      await prismaClient().productOnCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          categoryId,
          productId: productExist.id,
        })),
      });
    }
  
    // Nếu muốn xử lý update variantLabels / variantOptions, mình có thể viết thêm đoạn logic ở đây
  
    // Trả về product đã cập nhật kèm quan hệ
    return prismaClient().product.findUnique({
      where: { id: productExist.id },
      include: {
        categories: {
          include: { category: true },
        },
        VariantLabel: {
          include: {
            variantOptions: true,
          },
        },
      },
    });
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
      specifications: JSON.parse(product.specifications || "[]"),
      images: product.images.split(","),
      categories: (product as any).categories.map((item: any) => item.category),
    };
  }
}

export default new ProductService();
