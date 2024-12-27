import { Next } from "hono";
import { ROLE } from "../../share/constants/role.constant";
import { TContext } from "../types/type";
import { verify } from "hono/jwt";
import { User } from "@prisma/client";
import { ForbiddenException } from "../exception/forbidden.eception";

class AuthorizationMiddleware {
  use(...roles: ROLE[]) {
    return async (c: TContext, next: Next) => {
      try {
        const token =
          c.req.header().authorization?.split("Bearer")[1].trim() || "";
        const decoded = (await verify(token, c.env.JWT_SECRET_KEY)) as User;

        if (
          roles &&
          roles.length > 0 &&
          !roles.includes(decoded.role as ROLE)
        ) {
          throw new ForbiddenException();
        }

        c.set("userAuth", decoded);
        return next();
      } catch (error: any) {
        throw new ForbiddenException();
      }
    };
  }
}

export const authorizationMiddleware = new AuthorizationMiddleware();
