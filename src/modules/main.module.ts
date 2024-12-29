import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../core/base/module.base";
import { TBlankEnv } from "../core/types/type";
import { AuthModule } from "./auth/auth.module";
import { logger } from "hono/logger";
import { parsePayload } from "../core/middlewares/parsebody.middleware";
import { exceptionFilter } from "../core/filter/exception.filter";
import { setContext } from "../core/middlewares/env.middleware";
import { TResponse } from "../core/types/response";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { CartModule } from "./cart/cart.module";
import { cors } from "hono/cors";

export class MainModule extends BaseModule {
  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "/");
    this.config();
    this.errorHandler();
  }

  config() {
    this.app.use(
      cors({
        origin: "*",
      })
    );
    this.app.use(logger());
    this.app.use(parsePayload);
    this.app.use(setContext);

    this.app.notFound((c) => {
      const response: TResponse<any> = {
        message: "Not found",
        statusCode: 404,
        currentTimestamp: new Date().getTime(),
      };

      return c.json(response, 404);
    });
  }

  modules() {
    // Add your modules here
    new AuthModule(this.app).addRoute();
    new UserModule(this.app).addRoute();
    new CategoryModule(this.app).addRoute();
    new ProductModule(this.app).addRoute();
    new OrderModule(this.app).addRoute();
    new CartModule(this.app).addRoute();
  }

  errorHandler() {
    this.app.onError(exceptionFilter);
  }
}
