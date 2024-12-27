import { TContext } from "../../core/types/type";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";
import categoryService from "./category.service";

export class CategoryController {
  async getAll(c: TContext) {
    const data = await categoryService.getAll();
    return transformInterceptor(c, data);
  }

  async create(c: TContext) {
    const input = c.get("parsedBody");

    const data = await categoryService.create(input);
    return transformInterceptor(c, data);
  }

  async update(c: TContext) {
    const id = c.req.param("id");
    const input = c.get("parsedBody");

    const data = await categoryService.update(id, input);
    return transformInterceptor(c, data);
  }

  async delete(c: TContext) {
    const id = c.req.param("id");

    const data = await categoryService.delete(id);
    return transformInterceptor(c, data);
  }
}
