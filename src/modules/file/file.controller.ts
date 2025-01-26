import { TContext } from "../../core/types/type";
import fileService from "./file.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

export class FileController {
  async create(c: TContext) {
    const userAuth = c.get("userAuth");
    const input = c.get("parsedBody");

    const data = await fileService.create(input, userAuth.id);
    return transformInterceptor(c, data);
  }

  async getAll(c: TContext) {
    const filter = c.get("parsedQuery");

    const data = await fileService.getAll(filter);
    return transformInterceptor(c, data);
  }
}
