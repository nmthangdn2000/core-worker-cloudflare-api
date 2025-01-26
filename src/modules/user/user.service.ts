import { User } from "@prisma/client";
import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TUserUpdateSchema } from "./schema/user-update.schema";
import { PaginationResponse } from "../../core/base/pagination.base";
import { TUserFilterSchema } from "./schema/user-get.schema";
import { ROLE } from "../../share/constants/role.constant";

class UserService {
  async me(id: string) {
    const user = await prismaClient().user.findUnique({
      where: {
        id,
      },
    });

    delete (user as any).password;

    return user;
  }

  async getOne(id: string, user: User) {
    if (user.role !== ROLE.ADMIN) {
      throw new BadRequestException(ERROR_MESSAGES.PermissionDenied);
    }

    const userExist = await prismaClient().user.findUnique({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new BadRequestException(ERROR_MESSAGES.UserNotFound);
    }

    delete (userExist as any).password;

    return userExist;
  }

  async getAll(filter: TUserFilterSchema, user: User) {
    console.log(user);

    if (user.role !== ROLE.ADMIN) {
      throw new BadRequestException(ERROR_MESSAGES.PermissionDenied);
    }

    const [users, totalItems] = await Promise.all([
      prismaClient().user.findMany({
        where: {},
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: (filter.page - 1) * filter.take,
        take: filter.take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prismaClient().user.count({
        where: {},
      }),
    ]);

    return new PaginationResponse({
      items: users,
      take: filter.take,
      page: filter.page,
      totalItems,
    });
  }

  async update(id: string, input: TUserUpdateSchema) {
    const userExist = await prismaClient().user.findUnique({
      where: {
        id,
      },
    });

    if (!userExist) {
      throw new BadRequestException(ERROR_MESSAGES.UserNotFound);
    }

    const user = await prismaClient().user.update({
      where: {
        id,
      },
      data: input,
    });

    delete (user as any).password;

    return user;
  }
}

export default new UserService();
