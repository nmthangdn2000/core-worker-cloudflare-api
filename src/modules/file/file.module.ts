import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { FileController } from "./file.controller";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";
import { validatorMiddleware } from "../../core/middlewares/validator.middleware";
import { fileFilterSchema } from "./schema/file-get.schema";
import { fileCreateSchema } from "./schema/file-create.schema";

export class FileModule extends BaseModule {
  private readonly fileController: FileController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "file");

    this.fileController = new FileController();
    this.init();
  }

  init() {
    this.appModule.get(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(fileFilterSchema, "query"),
      this.fileController.getAll
    );

    this.appModule.post(
      "/",
      authorizationMiddleware.use(),
      validatorMiddleware(fileCreateSchema),
      this.fileController.create
    );
  }
}
