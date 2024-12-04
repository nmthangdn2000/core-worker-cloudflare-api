import { TContext } from "../../core/base/type";
import authService from "./auth.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

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
