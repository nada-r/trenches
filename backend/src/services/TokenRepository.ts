import { PrismaClient, Token } from '@prisma/client';

export type TokenInfo = {
  tokenAddress: string;
  fdv: number;
  symbol: string;
  chain: string;
  name: string;
  url: string;
  image_uri: string;
  type: 'pumpfun' | 'raydium';
  poolAddress?: string;
};

export type TokenMcap = {
  mcap: number;
  highest: number;
};

export class TokenRepository {
  constructor(private prisma: PrismaClient) {}

  async createOrUpdateToken(tokenInfo: TokenInfo): Promise<Token | null> {
    try {
      return this.prisma.token.upsert({
        where: {
          address: tokenInfo.tokenAddress,
        },
        update: {
          url: tokenInfo.url,
          image_uri: tokenInfo.image_uri,
          data: {
            type: tokenInfo.type,
            poolAddress: tokenInfo.poolAddress,
            mcap: tokenInfo.fdv,
          },
        },
        create: {
          address: tokenInfo.tokenAddress,
          name: tokenInfo.name,
          ticker: tokenInfo.symbol,
          url: tokenInfo.url,
          image_uri: tokenInfo.image_uri,
          data: {
            type: tokenInfo.type,
            poolAddress: tokenInfo.poolAddress,
            mcap: tokenInfo.fdv,
          },
        },
      });
    } catch (error) {
      console.error('Error creating token:', error);
      return null;
    }
  }

  async updateMcap(tokenAddress: string, mcap: number): Promise<void> {
    try {
      const token = await this.prisma.token.findUnique({
        where: {
          address: tokenAddress,
        },
      });

      if (!token) {
        throw new Error(`Token with address ${tokenAddress} not found`);
      }

      await this.prisma.token.update({
        where: {
          address: tokenAddress,
        },
        data: {
          data: {
            ...token.data,
            mcap: mcap,
          },
        },
      });
    } catch (error) {
      console.error(`Error updating mcap for token ${tokenAddress}:`, error);
      throw error; // Re-throw the error for the caller to handle if needed
    }
  }

  // TOOLING

  async findMissingTokens(): Promise<string[]> {
    try {
      const calls = await this.prisma.call.findMany({
        select: {
          tokenAddress: true,
        },
        distinct: ['tokenAddress'],
        where: {
          tokenAddress: {
            notIn: await this.prisma.token
              .findMany({
                select: { address: true },
              })
              .then((tokens) => tokens.map((token) => token.address)),
          },
        },
      });

      return calls.map((call) => call.tokenAddress);
    } catch (error) {
      console.error('Error finding missing tokens:', error);
      throw error;
    }
  }
}
