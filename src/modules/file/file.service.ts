import { User } from "@prisma/client";
import { prismaClient } from "../../core/middlewares/database.middleware";
import { TUserUpdateSchema } from "./schema/file-update.schema";

class FileService {
  async upload(files: File[], userAuth: User) {
    // const buffers = await Promise.all(
    //   files.map((file) => {
    //     return {
    //       name: file.name,
    //       buffer: file.arrayBuffer(),
    //     };
    //   })
    // );

    // const data = await prismaClient().file.createMany({
    //   data: files.map((file) => {
    //     return {
    //       name: file.name,
    //       url: "/uploads/" + file.name,
    //       type: file.type,
    //       size: file.size,
    //       userId: userAuth.id,
    //     };
    //   }),
    // });

    const data = await Promise.all(
      files.map(async (file) => {
        const data = await prismaClient().file.create({
          data: {
            name: file.name,
            url: "/uploads/" + file.name,
            type: file.type,
            size: file.size,
            userId: userAuth.id,
          },
        });

        return data;
      })
    );

    return data;
  }

  async delete(id: string, input: TUserUpdateSchema) {}
}

export default new FileService();
