import { Next } from "hono";
import { ROLE } from "../../share/constants/role.constant";
import { TContext } from "../types/type";
import { verify } from "hono/jwt";
import { User } from "@prisma/client";
import { ForbiddenException } from "../exception/forbidden.eception";
import { prismaClient } from "./database.middleware";

class AuthorizationMiddleware {
  use(...roles: ROLE[]) {
    return async (c: TContext, next: Next) => {
      try {
        const token =
          c.req.header().authorization?.split("Bearer")[1].trim() || "";
        const decoded = (await verify(token, c.env.JWT_SECRET_KEY)) as User;

        const user = await prismaClient().user.findUnique({
          where: {
            id: decoded.id,
          },
        });

        if (!user) {
          throw new ForbiddenException();
        }

        if (roles && roles.length > 0 && !roles.includes(user.role as ROLE)) {
          throw new ForbiddenException();
        }

        c.set("userAuth", user);
        return next();
      } catch (error: any) {
        throw new ForbiddenException();
      }
    };
  }
}

export const authorizationMiddleware = new AuthorizationMiddleware();
