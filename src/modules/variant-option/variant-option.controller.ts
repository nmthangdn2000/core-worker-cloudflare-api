import { TContext } from "../../core/types/type";
import variantOptionService from "./variant-option.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

export class VariantOptionController {
  async create(c: TContext) {
    const userAuth = c.get("userAuth");
    const input = c.get("parsedBody");

    const data = await variantOptionService.create(input, userAuth.id);
    return transformInterceptor(c, data);
  }
}
