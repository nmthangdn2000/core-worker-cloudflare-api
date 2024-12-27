import { Hono } from "hono";
import { BlankSchema } from "hono/types";
import { TBlankEnv } from "../types/type";

export class BaseModule {
  readonly app: Hono<TBlankEnv, BlankSchema, "/">;
  readonly appModule: Hono<TBlankEnv, BlankSchema, string>;
  private readonly basePath: string;

  constructor(app: Hono<TBlankEnv, BlankSchema, "/">, basePath: string) {
    this.app = app;
    this.basePath = basePath;

    this.appModule = new Hono<TBlankEnv>();
  }

  addRoute() {
    this.app.route(`/${this.basePath}`, this.appModule);
  }
}
