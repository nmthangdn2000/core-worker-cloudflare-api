import { TContext } from "../../core/types/type";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";
import orderService from "./order.service";

export class OrderController {
  async getOne(c: TContext) {
    const id = c.req.param("id");
    const data = await orderService.getOne(id);
    return transformInterceptor(c, data);
  }

  async getAll(c: TContext) {
    const data = await orderService.getAll(c.get("parsedQuery"));
    return transformInterceptor(c, data);
  }

  async create(c: TContext) {
    const input = c.get("parsedBody");
    const userAuth = c.get("userAuth");

    const data = await orderService.create(input, userAuth.id);
    return transformInterceptor(c, data);
  }

  async update(c: TContext) {
    const id = c.req.param("id");
    const input = c.get("parsedBody");
    const userAuth = c.get("userAuth");

    const data = await orderService.update(id, input, userAuth);
    return transformInterceptor(c, data);
  }

  async delete(c: TContext) {
    const id = c.req.param("id");
    const userAuth = c.get("userAuth");

    const data = await orderService.delete(id, userAuth);
    return transformInterceptor(c, data);
  }
}
