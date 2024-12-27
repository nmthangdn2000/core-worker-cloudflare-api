import { TContext } from "../../core/types/type";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";
import productService from "./product.service";

export class ProductController {
  async getOne(c: TContext) {
    const id = c.req.param("id");
    const data = await productService.getOne(id);
    return transformInterceptor(c, data);
  }

  async getAll(c: TContext) {
    const data = await productService.getAll(c.get("parsedQuery"));
    return transformInterceptor(c, data);
  }

  async create(c: TContext) {
    const input = c.get("parsedBody");

    const data = await productService.create(input);
    return transformInterceptor(c, data);
  }

  async update(c: TContext) {
    const id = c.req.param("id");
    const input = c.get("parsedBody");

    const data = await productService.update(id, input);
    return transformInterceptor(c, data);
  }

  async delete(c: TContext) {
    const id = c.req.param("id");

    const data = await productService.delete(id);
    return transformInterceptor(c, data);
  }
}
