import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { stringToSlug } from "../../utils/util";
import { TCategoryCreateSchema } from "./schema/category-create.schema";
import { TCategoryUpdateSchema } from "./schema/category-update.schema";

class CategoryService {
  async getAll() {
    const categories = await prismaClient().category.findMany();

    return categories;
  }

  async statistic() {
    const categories = await prismaClient().category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      totalProducts: category._count.products,
    }));
  }

  async create(input: TCategoryCreateSchema) {
    const category = await prismaClient().category.create({
      data: {
        name: input.name,
        slug: stringToSlug(input.name),
      },
    });

    return category;
  }

  async update(id: string, input: TCategoryUpdateSchema) {
    const categoryExist = await prismaClient().category.findUnique({
      where: {
        id,
      },
    });

    if (!categoryExist) {
      throw new BadRequestException(ERROR_MESSAGES.CategoryNotFound);
    }

    const category = await prismaClient().category.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        slug: stringToSlug(input.name),
      },
    });

    return category;
  }

  async delete(id: string) {
    const categoryExist = await prismaClient().category.findUnique({
      where: {
        id,
      },
    });

    if (!categoryExist) {
      throw new BadRequestException(ERROR_MESSAGES.CategoryNotFound);
    }

    await prismaClient().category.delete({
      where: {
        id,
      },
    });

    return {
      message: "Delete category successfully",
    };
  }
}

export default new CategoryService();
