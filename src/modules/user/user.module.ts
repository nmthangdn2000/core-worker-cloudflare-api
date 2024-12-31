import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { UserController } from "./user.controller";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { ROLE } from "../../share/constants/role.constant";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { userFilterSchema } from "./schema/user-get.schema";

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

    this.appModule.get(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      validatorMiddleware(userFilterSchema, "query"),
      this.userController.getAll
    );

    this.appModule.patch(
      "/me",
      authorizationMiddleware.use(),
      this.userController.update
    );
  }
}
