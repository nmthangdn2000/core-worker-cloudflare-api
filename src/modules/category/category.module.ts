import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { CategoryController } from "./category.controller";
import { ROLE } from "../../share/constants/role.constant";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { categoryCreateSchema } from "./schema/category-create.schema";
import { categoryUpdateSchema } from "./schema/category-update.schema";

export class CategoryModule extends BaseModule {
  private readonly categoryController: CategoryController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "user");

    this.categoryController = new CategoryController();
    this.init();
  }

  init() {
    this.appModule.get(
      "/",
      authorizationMiddleware.use(),
      this.categoryController.getAll
    );

    this.appModule.post(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      validatorMiddleware(categoryCreateSchema),
      this.categoryController.create
    );

    this.appModule.patch(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      validatorMiddleware(categoryUpdateSchema),
      this.categoryController.update
    );

    this.appModule.delete(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      this.categoryController.delete
    );
  }
}
