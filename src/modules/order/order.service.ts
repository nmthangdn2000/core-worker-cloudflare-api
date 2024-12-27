import { Prisma, User } from "@prisma/client";
import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TOrderCreateSchema } from "./schema/order-create.schema";
import { TOrderFilterSchema } from "./schema/order-get.schema";
import { TOrderUpdateSchema } from "./schema/order-update.schema";
import { PaginationResponse } from "../../core/base/pagination.base";
import { ROLE } from "../../share/constants/role.constant";
import { ORDER_STATUS } from "./order.type";

class OrderService {
  async getOne(id: string) {
    const order = await prismaClient().order.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestException(ERROR_MESSAGES.OrderNotFound);
    }

    return order;
  }

  async getAll(query: TOrderFilterSchema) {
    const where: Prisma.OrderWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate) {
      where.createdAt = {
        gte: new Date(query.startDate),
      };
    }

    if (query.endDate) {
      where.createdAt = {
        lte: new Date(query.endDate),
      };
    }

    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (query.sortKey) {
      orderBy[query.sortKey] = query.sortOrder || "asc";
    }

    const [orders, totalItems] = await Promise.all([
      prismaClient().order.findMany({
        where,
        skip: (query.page - 1) * query.take,
        take: query.take,
        orderBy,
      }),
      prismaClient().order.count({
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

  async create(input: TOrderCreateSchema, userId: string) {
    const products = await prismaClient().product.findMany({
      where: {
        id: {
          in: input.products.map((product) => product.id),
        },
      },
    });

    const missingIds = input.products
      .map((product) => product.id)
      .filter((id) => !products.some((product) => product.id === id));

    if (missingIds.length > 0) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    // order và orderItem
    const order = await prismaClient().order.create({
      data: {
        note: input.note,
        status: ORDER_STATUS.PENDING,
        total: products.reduce((total, product) => {
          const orderItem = input.products.find((p) => p.id === product.id);
          return (
            total +
            product.price * orderItem!.quantity * (product.discount || 1)
          );
        }, 0),
        userId,
        orderItems: {
          create: input.products.map((product) => ({
            quantity: product.quantity,
            productId: product.id,
            price: products.find((p) => p.id === product.id)!.price,
          })),
        },
      },
    });

    return this.getOne(order.id);
  }

  async update(id: string, input: TOrderUpdateSchema, user: User) {
    const orderExist = await prismaClient().order.findUnique({
      where: {
        id,
      },
    });

    if (!orderExist) {
      throw new BadRequestException(ERROR_MESSAGES.OrderNotFound);
    }

    // nếu là pending thì mới cho người dùng update còn không thìphải là admin
    if (user.role === ROLE.USER) {
      if (orderExist.status !== ORDER_STATUS.PENDING) {
        throw new BadRequestException(ERROR_MESSAGES.OrderNotAllowUpdate);
      }

      delete input.status;
      delete input.noteAdmin;
    }

    const order = await prismaClient().order.update({
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
    const productExist = await prismaClient().order.findUnique({
      where: {
        id,
      },
    });

    if (!productExist) {
      throw new BadRequestException(ERROR_MESSAGES.ProductNotFound);
    }

    if (
      user.role === ROLE.USER &&
      productExist.status !== ORDER_STATUS.PENDING
    ) {
      throw new BadRequestException(ERROR_MESSAGES.OrderNotAllowDelete);
    }

    await prismaClient().order.delete({
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
