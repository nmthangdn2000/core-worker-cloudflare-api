import { prismaClient } from "../../core/middlewares/database.middleware";
import { TVariantOptionCreateSchema } from "./schema/variant-option-create.schema";

class VariantOptionService {
  async create(data: TVariantOptionCreateSchema, userId: string) {
    const file = await prismaClient().file.create({
      data,
    });

    return file;
  }
}

export default new VariantOptionService();
