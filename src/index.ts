import { Hono } from "hono";
import { MainModule } from "./modules/main.module";
import { TBlankEnv } from "./core/types/type";

const app = new Hono<TBlankEnv>();

const mainModule = new MainModule(app);
mainModule.modules();

export default app;
