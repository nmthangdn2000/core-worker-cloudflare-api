import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/base/type";
import { AuthController } from "./auth.controller";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { loginSchema } from "./schema/login.schema";
import { registerSchema } from "./schema/register.schema";

export class AuthModule extends BaseModule {
  private readonly authController: AuthController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "auth");

    this.authController = new AuthController();

    this.init();
  }

  init() {
    this.appModule.post(
      "/login",
      validatorMiddleware(loginSchema),
      this.authController.login
    );

    this.appModule.post(
      "/register",
      validatorMiddleware(registerSchema),
      this.authController.register
    );
  }
}
