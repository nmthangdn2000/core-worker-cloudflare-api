import { TContext } from "../../core/base/type";
import userService from "./user.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

export class UserController {
  async me(c: TContext) {
    const userAuth = c.get("userAuth");

    const data = await userService.me(userAuth.id);
    return transformInterceptor(c, data);
  }
}
