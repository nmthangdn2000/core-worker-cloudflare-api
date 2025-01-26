import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { VariantLabelController } from "./variant-label.controller";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { variantLabelCreateSchema } from "./schema/variant-label-create.schema";

export class VariantLabelModule extends BaseModule {
  private readonly variantLabelController: VariantLabelController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "variant-label");

    this.variantLabelController = new VariantLabelController();
    this.init();
  }

  init() {
    this.appModule.post(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(variantLabelCreateSchema),
      this.variantLabelController.create
    );
  }
}
