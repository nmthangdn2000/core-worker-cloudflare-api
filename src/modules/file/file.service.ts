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
}

export default new FileService();
