import { Caller, PrismaClient } from '@prisma/client';
import { OmitPrisma } from '@src/types';

export class CallerService {
  constructor(private prisma: PrismaClient) {}

  async createCaller(data: OmitPrisma<Caller>): Promise<Caller> {
    return this.prisma.caller.create({
      data,
    });
  }

  async getAll(): Promise<Caller[]> {
    return this.prisma.caller.findMany({});
  }

  async getCallerByTelegramId(telegramId: string): Promise<Caller | null> {
    return this.prisma.caller.findUnique({
      where: {
        telegramId: telegramId,
      },
    });
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
        data: {},
      });
    }
    return caller;
  }

  async updateCallingPower(telegramId: string, power: number): Promise<Caller> {
    return this.prisma.caller.update({
      where: {
        telegramId,
      },
      data: {
        data: {
          power,
        },
      },
    });
  }
}
