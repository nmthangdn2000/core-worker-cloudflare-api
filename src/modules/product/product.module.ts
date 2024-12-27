import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { TBlankEnv } from "../../core/types/type";
import { ROLE } from "../../share/constants/role.constant";
import { ProductController } from "./product.controller";
import { productCreateSchema } from "./schema/product-create.schema";
import { productFilterSchema } from "./schema/product-get.schema";
import { productUpdateSchema } from "./schema/product-update.schema";

export class ProductModule extends BaseModule {
  private readonly productController: ProductController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "product");

    this.productController = new ProductController();
    this.init();
  }

  init() {
    this.appModule.get("/:id", this.productController.getOne);

    this.appModule.get(
      "/",
      validatorMiddleware(productFilterSchema, "query"),
      this.productController.getAll
    );

    this.appModule.post(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      validatorMiddleware(productCreateSchema),
      this.productController.create
    );

    this.appModule.patch(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      validatorMiddleware(productUpdateSchema),
      this.productController.update
    );

    this.appModule.delete(
      "/",
      authorizationMiddleware.use(ROLE.ADMIN),
      this.productController.delete
    );
  }
}
