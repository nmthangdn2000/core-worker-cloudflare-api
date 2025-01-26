import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { BaseModule } from "../../core/base/module.base";
import { TBlankEnv } from "../../core/types/type";
import { FileController } from "./file.controller";
import { authorizationMiddleware } from "../../core/middlewares/authorization.middleware";

export class FileModule extends BaseModule {
  private readonly fileController: FileController;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">) {
    super(app, "file");

    this.fileController = new FileController();
    this.init();
  }

  init() {
    this.appModule.post(
      "/",
      authorizationMiddleware.use(),
      this.fileController.upload
    );

    // this.appModule.delete(
    //   "/:url",
    //   authorizationMiddleware.use(),
    //   this.fileController.delete
    // );
  }
}
