import { Call, Caller, PrismaClient } from '@prisma/client';
import { OmitPrisma } from '@src/types';
import { mintToken } from '@src/services/mint';

export class CallerRepository {
  private prismaExtended;

  constructor(private prisma: PrismaClient) {
    this.prismaExtended = prisma.$extends({
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

  async getAll(): Promise<Caller[]> {
    const callers = await this.prisma.caller.findMany({});
    return callers.sort((a, b) => {
      const rankA = a.data?.rank || Number.MAX_SAFE_INTEGER;
      const rankB = b.data?.rank || Number.MAX_SAFE_INTEGER;
      return rankA - rankB;
    });
  }

  async getCallersWithCallsOnTokens(
    tokenAddresses: string[]
  ): Promise<Caller[]> {
    return this.prisma.caller.findMany({
      where: {
        calls: {
          some: {
            tokenAddress: {
              in: tokenAddresses,
            },
          },
        },
      },
      // include: {
      //   calls: {
      //     where: {
      //       tokenAddress: {
      //         in: tokenAddresses
      //       }
      //     }
      //   }
      // }
    });
  }

  async getCallerByTelegramId(telegramId: string): Promise<Caller | null> {
    return this.prisma.caller.findUnique({
      where: {
        telegramId,
      },
    });
  }

  async getCallerWithCall(
    id: number
  ): Promise<(Caller & { openCalls: Call[]; closedCalls: Call[] }) | null> {
    const caller = await this.prismaExtended.caller.findUnique({
      where: {
        id: id,
      },
      include: {
        calls: true,
      },
    });

    if (!caller) return null;

    const tokenAddresses = [
      ...new Set(caller.calls.map((call) => call.tokenAddress)),
    ];
    const tokens = await this.prisma.token.findMany({
      where: {
        address: {
          in: tokenAddresses,
        },
      },
    });

    const tokenMap = new Map(tokens.map((token) => [token.address, token]));

    const callerWithTokens = {
      ...caller,
      calls: caller.calls.map((call) => ({
        ...call,
        token: tokenMap.get(call.tokenAddress) || null,
      })),
    };

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const openCalls = callerWithTokens.calls
      .filter((call: Call) => new Date(call.createdAt) >= twentyFourHoursAgo)
      .sort(
        (a: Call, b: Call) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const closedCalls = callerWithTokens.calls
      .filter((call: Call) => new Date(call.createdAt) < twentyFourHoursAgo)
      .sort(
        (a: Call, b: Call) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return {
      ...callerWithTokens,
      openCalls,
      closedCalls,
    };
  }

  async createCaller(data: OmitPrisma<Caller>): Promise<Caller> {
    return this.prisma.caller.create({
      data,
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
      const tokenAddress = await mintToken(
        image || 'https://trenches.fra1.cdn.digitaloceanspaces.com/Shrek.jpg',
        username
      );

      if (tokenAddress) {
        await this.addCallerTokenAddress(telegramId, tokenAddress);
      }
    }
    console.log('callerImageURL:', image);
    return caller;
  }

  async addCallerTokenAddress(
    telegramId: string,
    tokenAddress: string
  ): Promise<void> {
    const caller = await this.prisma.caller.findUnique({
      where: {
        telegramId,
      },
    });

    if (!caller) {
      console.log('Caller not found, telegram id', telegramId);
      return;
    }
    await this.prisma.caller.update({
      where: {
        telegramId,
      },
      data: {
        data: {
          ...caller.data,
          tokenAddress,
        },
      },
    });
  }

  async updateCallingPower(id: number, power: number): Promise<Caller> {
    const caller = await this.prisma.caller.findUnique({
      where: { id },
    });

    if (!caller) {
      throw new Error(`Caller with id ${id} not found`);
    }

    return this.prisma.caller.update({
      where: { id },
      data: {
        data: {
          ...caller.data,
          power,
        },
      },
    });
  }

  async updateCallerRanks(): Promise<void> {
    const callers = await this.prisma.caller.findMany({});

    callers.sort((a, b) => (b.data?.power || 0) - (a.data?.power || 0));

    for (let i = 0; i < callers.length; i++) {
      await this.prisma.caller.update({
        where: { id: callers[i].id },
        data: { data: { ...callers[i].data, rank: i + 1 } },
      });
    }
  }
}
