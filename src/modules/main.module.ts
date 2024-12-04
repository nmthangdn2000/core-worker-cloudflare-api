import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../core/base/module.base";
import { TBlankEnv } from "../core/base/type";
import { AuthModule } from "./auth/auth.module";
import { logger } from "hono/logger";
import { parsePayload } from "../core/middlewares/parsebody.middleware";
import { exceptionFilter } from "../core/filter/exception.filter";
import { setContext } from "../core/middlewares/env.middleware";
import { TResponse } from "../core/base/response.base";
import { UserModule } from "./user/user.module";

export class MainModule extends BaseModule {
  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "/");
    this.config();
    this.errorHandler();
  }

  config() {
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
  }

  errorHandler() {
    this.app.onError(exceptionFilter);
  }
}
