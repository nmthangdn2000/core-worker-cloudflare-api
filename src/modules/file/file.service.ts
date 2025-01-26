<<<<<<< HEAD
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
=======
import { TUserUpdateSchema } from "./schema/file-update.schema";

class FileService {
  async upload(files: File[]) {
    const buffers = await Promise.all(
      files.map((file) => {
        return {
          name: file.name,
          buffer: file.arrayBuffer(),
        };
      })
    );

    console.log(buffers);
  }

  async delete(id: string, input: TUserUpdateSchema) {}
>>>>>>> 4c4fbbb9841da73830f11b3d37880285ac426c4f
}

export default new FileService();
