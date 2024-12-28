import { Prisma, User } from "@prisma/client";
import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TCartCreateSchema } from "./schema/cart-create.schema";
import { TCartFilterSchema } from "./schema/cart-get.schema";
import { TCartUpdateSchema } from "./schema/cart-update.schema";
import { PaginationResponse } from "../../core/base/pagination.base";

class OrderService {
  async getOne(id: string) {
    const order = await prismaClient().cart.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        product: true,
      },
    });

    if (!order) {
      throw new BadRequestException(ERROR_MESSAGES.OrderNotFound);
    }

    return order;
  }

  async getAll(query: TCartFilterSchema) {
    const where: Prisma.CartWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      createdAt: "desc",
    };

    const [orders, totalItems] = await Promise.all([
      prismaClient().cart.findMany({
        where,
        skip: (query.page - 1) * query.take,
        take: query.take,
        orderBy,
      }),
      prismaClient().cart.count({
        where,
      }),
    ]);

    return new PaginationResponse({
      items: orders,
      take: query.take,
      page: query.page,
      totalItems,
    });
  }

  async create(input: TCartCreateSchema, userId: string) {
    const cartExist = await prismaClient().cart.findFirst({
      where: {
        userId,
        productId: input.product,
      },
    });

    if (cartExist) {
      await prismaClient().cart.update({
        where: {
          id: cartExist.id,
        },
        data: {
          quantity: cartExist.quantity + input.quantity,
        },
      });

      return this.getOne(cartExist.id);
    }

    const cart = await prismaClient().cart.create({
      data: {
        productId: input.product,
        quantity: input.quantity,
        userId,
      },
    });

    return this.getOne(cart.id);
  }

  async update(id: string, input: TCartUpdateSchema, user: User) {
    const orderExist = await prismaClient().cart.findUnique({
      where: {
        id,
      },
    });

    if (!orderExist) {
      throw new BadRequestException(ERROR_MESSAGES.OrderNotFound);
    }

    // nếu là pending thì mới cho người dùng update còn không thìphải là admin
    const order = await prismaClient().cart.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });

    return order;
  }

  async delete(id: string, user: User) {
    const cartExist = await prismaClient().cart.findUnique({
      where: {
        id,
      },
    });

    if (!cartExist) {
      throw new BadRequestException(ERROR_MESSAGES.CartNotFound);
    }

    if (cartExist.userId !== user.id) {
      throw new BadRequestException(ERROR_MESSAGES.CartNotAllowDelete);
    }

    await prismaClient().cart.delete({
      where: {
        id,
      },
    });

    return {
      message: "Delete product successfully",
    };
  }
}

export default new OrderService();
