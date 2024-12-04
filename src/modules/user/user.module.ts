import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/base/type";
import { UserController } from "./user.controller";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";

export class UserModule extends BaseModule {
  private readonly userController: UserController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "user");

    this.userController = new UserController();
    this.init();
  }

  init() {
    this.appModule.get(
      "/me",
      authorizationMiddleware.use(),
      this.userController.me
    );
  }
}
