import { prismaClient } from "../../core/middlewares/database.middleware";
import { TVariantLabelCreateSchema } from "./schema/variant-label-create.schema";

class VariantLabelService {
  async create(data: TVariantLabelCreateSchema, userId: string) {
    const file = await prismaClient().file.create({
      data,
    });

    return file;
  }
}

export default new VariantLabelService();
