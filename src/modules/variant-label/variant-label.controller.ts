import { TContext } from "../../core/types/type";
import variantLabelService from "./variant-label.service";
import { transformInterceptor } from "../../core/interceptors/transform.interceptor";

export class VariantLabelController {
  async create(c: TContext) {
    const userAuth = c.get("userAuth");
    const input = c.get("parsedBody");

    const data = await variantLabelService.create(input, userAuth.id);
    return transformInterceptor(c, data);
  }
}
