import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { VariantOptionController } from "./variant-option.controller";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { variantOptionCreateSchema } from "./schema/variant-option-create.schema";

export class VariantOptionModule extends BaseModule {
  private readonly variantOptionController: VariantOptionController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "variant-option");

    this.variantOptionController = new VariantOptionController();
    this.init();
  }

  init() {
    this.appModule.post(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(variantOptionCreateSchema),
      this.variantOptionController.create
    );
  }
}
