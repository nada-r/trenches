import { PrismaClient, Caller, Prisma } from '@prisma/client';
import { OmitPrisma } from '@src/types';

export class CallerService {
  constructor(private prisma: PrismaClient) {}

  async createCaller(data: OmitPrisma<Caller>): Promise<Caller> {
    const caller = await this.prisma.caller.create({
      data,
    });
    return caller;
  }

  async getCallerByTelegramId(telegramId: string): Promise<Caller | null> {
    const caller = await this.prisma.caller.findUnique({
      where: {
        telegramId: telegramId,
      },
    });
    return caller;
  }

  async getOrCreateCaller(
    telegramId: string,
    username: string,
    image?: string
  ): Promise<Caller> {
    let caller = await this.getCallerByTelegramId(telegramId);
    if (!caller) {
      caller = await this.createCaller({
        telegramId,
        name: username,
        image: image || null,
      });
    }
    return caller;
  }
}
