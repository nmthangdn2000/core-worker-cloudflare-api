import { prismaClient } from "../../core/middlewares/database.middleware";

class UserService {
  async me(id: string) {
    const user = await prismaClient().user.findUnique({
      where: {
        id,
      },
    });

    delete (user as any).password;

    return user;
  }
}

export default new UserService();
