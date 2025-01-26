import { Prisma } from "@prisma/client";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TFileCreateSchema } from "./schema/file-create.schema";
import { TFileFilterSchema } from "./schema/file-get.schema";

class FileService {
  async create(data: TFileCreateSchema, userId: string) {
    const file = await prismaClient().file.create({
      data: {
        ...data,
        userId,
      },
    });

    return file;
  }

  async getAll(filter: TFileFilterSchema) {
    const where: Prisma.FileWhereInput = {};

    if (filter.name) {
      where.OR = [
        {
          name: {
            contains: filter.name,
          },
        },
      ];
    }

    const files = await prismaClient().file.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return files;
  }
}

export default new FileService();
