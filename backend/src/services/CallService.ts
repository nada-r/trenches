import { Call, PrismaClient } from '@prisma/client';
import { OmitPrisma } from '@src/types';

export class CallService {
  private prisma;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma.$extends({
      result: {
        call: {
          multiple: {
            needs: { startFDV: true, highestFDV: true },
            compute(call) {
              return call.highestFDV / call.startFDV;
            },
          },
        },
      },
    });
  }

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

  async getOpenCalls(): Promise<Call[]> {
    return await this.prisma.call.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        token: true,
        caller: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }

  async getClosedCalls(): Promise<Call[]> {
    return this.prisma.call.findMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      include: {
        token: true,
        caller: {
          select: {
            name: true,
            image: true,
          },
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

  async updateCallHighestMcap(callId: number, newMcap: number): Promise<any> {
    return this.prisma.call.updateMany({
      where: {
        id: callId,
        highestFDV: { lt: newMcap },
      },
      data: {
        highestFDV: newMcap,
        updatedAt: new Date(),
      },
    });
  }

  async updateCallTokenPoolAddress(
    tokenAddress: string,
    poolAddress: string
  ): Promise<void> {
    try {
      // Find all calls for the given token address
      const calls = await this.prisma.call.findMany({
        where: {
          tokenAddress: tokenAddress,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      });

      // Update each call's data with the new pool address
      for (const call of calls) {
        const currentData = call.data as PrismaJson.CallData | null;
        const updatedData: PrismaJson.CallData = {
          ...currentData,
          poolAddress: poolAddress,
        };

        // Update the call with the new data
        await this.prisma.call.update({
          where: { id: call.id },
          data: { data: updatedData },
        });
      }

      console.log(
        `Updated pool address for token ${tokenAddress} to ${poolAddress}`
      );
    } catch (error) {
      console.error(
        `Error updating pool address for token ${tokenAddress}:`,
        error
      );
      throw error;
    }
  }
}
