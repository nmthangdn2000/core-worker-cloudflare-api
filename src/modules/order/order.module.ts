import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { orderUpdateSchema } from "./schema/order-update.schema";
import { orderCreateSchema } from "./schema/order-create.schema";
import { OrderController } from "./order.controller";
import { orderFilterSchema } from "./schema/order-get.schema";

export class OrderModule extends BaseModule {
  private readonly orderController: OrderController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "order");

    this.orderController = new OrderController();
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
      validatorMiddleware(orderFilterSchema, "query"),
      this.orderController.getAll
    );

    this.appModule.post(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(orderCreateSchema),
      this.orderController.create
    );

    this.appModule.patch(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(orderUpdateSchema),
      this.orderController.update
    );

    this.appModule.delete(
      "/",
      authorizationMiddleware.use(),
      this.orderController.delete
    );
  }
}
