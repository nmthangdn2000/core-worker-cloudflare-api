import { TContext } from "../../core/types/type";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";
import productService from "./product.service";

export class ProductController {
  async getOne(c: TContext) {
    const slug = c.req.param("slug");
    const data = await productService.getOne(slug);
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
    const slug = c.req.param("slug");
    const input = c.get("parsedBody");

    const data = await productService.update(slug, input);
    return transformInterceptor(c, data);
  }

  async delete(c: TContext) {
    const id = c.req.param("id");

    const data = await productService.delete(id);
    return transformInterceptor(c, data);
  }
}
