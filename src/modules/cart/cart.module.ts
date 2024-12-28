import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { cartCreateSchema } from "./schema/cart-create.schema";
import { CartController } from "./cart.controller";
import { cartFilterSchema } from "./schema/cart-get.schema";
import { cartUpdateSchema } from "./schema/cart-update.schema";

export class CartModule extends BaseModule {
  private readonly orderController: CartController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "cart");

    this.orderController = new CartController();
    this.init();
  }

  init() {
    this.appModule.get(
      "/:id",
      authorizationMiddleware.use(),
      this.orderController.getOne
    );

    this.appModule.get(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(cartFilterSchema, "query"),
      this.orderController.getAll
    );

    this.appModule.post(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(cartCreateSchema),
      this.orderController.create
    );

    this.appModule.patch(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(cartUpdateSchema),
      this.orderController.update
    );

    this.appModule.delete(
      "/",
      authorizationMiddleware.use(),
      this.orderController.delete
    );
  }
}
