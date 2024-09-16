import { PrismaClient, User } from '@prisma/client';
import { OmitPrisma } from '../types';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: OmitPrisma<User>) {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async getAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
}