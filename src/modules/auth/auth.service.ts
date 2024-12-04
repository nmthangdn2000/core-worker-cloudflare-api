import { prismaClient } from "../../core/middlewares/database.middleware";
import { TLoginSchema } from "./schema/login.schema";
import { TRegisterSchema } from "./schema/register.schema";
import { sha512 } from "../../utils/hash";
import { BadRequestException } from "../../core/exception/bad-request.eception";
import { ERROR_MESSAGES } from "../../common/error.common";
import { User } from "@prisma/client";
import { sign } from "hono/jwt";
import { getEnv } from "../../core/middlewares/env.middleware";
import { ROLE } from "../../share/constants/role.constant";

class AuthService {
  async login(input: TLoginSchema) {
    const user = await prismaClient().user.findFirst({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.UsernameOrPasswordIncorrect);
    }

    const password = await sha512(input.password);

    if (password !== user.password) {
      throw new BadRequestException(ERROR_MESSAGES.UsernameOrPasswordIncorrect);
    }

    delete (user as any).password;

    return {
      user,
      token: await this.generateToken(user),
    };
  }

  async register(input: TRegisterSchema) {
    const user = await prismaClient().user.create({
      data: {
        ...input,
        password: await sha512(input.password),
        status: "ACTIVE",
        role: ROLE.USER,
      },
    });

    delete (user as any).password;

    return user;
  }

  private generateToken(user: User) {
    const payload = {
      id: user.id,
      role: null,
    };

    return sign(payload, getEnv("JWT_SECRET_KEY"));
  }
}

export default new AuthService();
