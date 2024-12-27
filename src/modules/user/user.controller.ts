import { TContext } from "../../core/types/type";
import userService from "./user.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

export class UserController {
  async me(c: TContext) {
    const userAuth = c.get("userAuth");

    const data = await userService.me(userAuth.id);
    return transformInterceptor(c, data);
  }

  async update(c: TContext) {
    const userAuth = c.get("userAuth");
    const input = c.get("parsedBody");

    const data = await userService.update(userAuth.id, input);
    return transformInterceptor(c, data);
  }
}
