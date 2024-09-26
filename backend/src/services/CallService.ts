import { Call, PrismaClient } from '@prisma/client';
import { OmitPrisma } from '@src/types';

export class CallService {
  constructor(private prisma: PrismaClient) {}

  async createCall(data: OmitPrisma<Call>): Promise<Call> {
    return this.prisma.call.create({
      data,
    });
  }

  async getCallsByTelegramId(
    telegramId: string,
    start?: Date,
    end?: Date
  ): Promise<Call[]> {
    return this.prisma.call.findMany({
      where: {
        caller: { telegramId },
        ...((start || end) && {
          createdAt: {
            ...(start && { gte: start }),
            ...(end && { lt: end }),
          },
        }),
      },
    });
  }

  async getCallByTelegramIdAndToken(
    telegramId: string,
    tokenAddress: string
  ): Promise<Call | null> {
    return this.prisma.call.findFirst({
      where: {
        tokenAddress: tokenAddress,
        caller: {
          telegramId: telegramId,
        },
      },
    });
  }

  async getActiveCalls(): Promise<Call[]> {
    return this.prisma.call.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
  }

  async updateHighestFdvByToken(token: string, newFDV: number): Promise<any> {
    return this.prisma.call.updateMany({
      where: {
        tokenAddress: token,
        highestFDV: { lt: newFDV },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      data: {
        highestFDV: newFDV,
        updatedAt: new Date(),
      },
    });
  }
}
