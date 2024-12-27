import { ERROR_MESSAGES } from "../../common/error.common";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TUserUpdateSchema } from "./schema/user-update.schema";

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
