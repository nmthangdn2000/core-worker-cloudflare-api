import { TContext } from "../../core/types/type";
import authService from "./auth.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";
import { ROLE } from "../../share/constants/role.constant";

export class AuthController {
  async login(c: TContext) {
    const input = c.get("parsedBody");

    const data = await authService.login(input);
    return transformInterceptor(c, data);
  }

  async register(c: TContext) {
    const input = c.get("parsedBody");

    const data = await authService.register(input);
    return transformInterceptor(c, data);
  }
}
