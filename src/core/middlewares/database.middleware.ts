import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { getEnv } from "./env.middleware";

class DatabaseMiddleware {
  constructor() {}

  connect() {
    const adapter = new PrismaD1(getEnv("DB"));
    const prisma = new PrismaClient({ adapter });

    return prisma;
  }
}

export const prismaClient = new DatabaseMiddleware().connect;
