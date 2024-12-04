import { Next } from "hono";
import { TContext } from "../base/type";

class EnvMiddleware {
  private static instance: EnvMiddleware;
  private env: CloudflareBindings = {} as CloudflareBindings;

  private constructor() {
    // this.setContext = this.setContext.bind(this);
  }

  public static getInstance(): EnvMiddleware {
    if (!EnvMiddleware.instance) {
      EnvMiddleware.instance = new EnvMiddleware();
    }

    return EnvMiddleware.instance;
  }

  setContext(c: TContext, next: Next) {
    this.env = { ...c.env };

    return next();
  }

  getEnv<T extends keyof CloudflareBindings>(key: T): CloudflareBindings[T] {
    // Giả sử bạn có cách lấy giá trị từ CloudflareBindings

    return this.env[key];
  }
}
export const setContext = EnvMiddleware.getInstance().setContext.bind(
  EnvMiddleware.getInstance()
);
export const getEnv = EnvMiddleware.getInstance().getEnv.bind(
  EnvMiddleware.getInstance()
);
