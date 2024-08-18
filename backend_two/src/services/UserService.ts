import { PrismaClient, User } from "@prisma/client";
import { omitPrisma } from "@src/types";

export class UserService {
  constructor(private prisma: PrismaClient) {

  }
  async createUser(data: omitPrisma<User>) {
    const user = await this.prisma.user.create(
        {
            data,
        }
    )
    return user;
  }
}