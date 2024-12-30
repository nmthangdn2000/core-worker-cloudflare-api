import { TContext } from "../../core/types/type";
import fileService from "./file.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

export class FileController {
  async upload(c: TContext) {
    const files = (await c.req.parseBody({ all: true }))[
      "files"
    ] as any as File[];

    const data = await fileService.upload(files);
    return transformInterceptor(c, data);
  }

  async delete(c: TContext) {
    const userAuth = c.get("userAuth");
    const input = c.get("parsedBody");

    const data = await fileService.delete(userAuth.id, input);
    return transformInterceptor(c, data);
  }
}
