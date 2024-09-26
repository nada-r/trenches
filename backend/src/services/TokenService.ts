import { PrismaClient, Token } from '@prisma/client';

export interface TokenInfo {
  address: string;
  fdv: number;
  symbol: string;
  chain: string;
  name: string;
  url: string;
  image_uri: string;
  type: 'pumpfun' | 'raydium';
  poolAddress?: string;
}

export class TokenService {
  constructor(private prisma: PrismaClient) {}

  async createToken(tokenInfo: TokenInfo): Promise<void> {
    try {
      const token = await this.prisma.token.upsert({
        where: {
          address: tokenInfo.address,
        },
        update: {
          url: tokenInfo.url,
          image_uri: tokenInfo.image_uri,
          data: {
            type: tokenInfo.type,
            poolAddress: tokenInfo.poolAddress,
          },
        },
        create: {
          address: tokenInfo.address,
          name: tokenInfo.name,
          ticker: tokenInfo.symbol,
          url: tokenInfo.url,
          image_uri: tokenInfo.image_uri,
          data: {
            type: tokenInfo.type,
            poolAddress: tokenInfo.poolAddress,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return;
      }
      console.error('Error creating token:', error);
    }
  }

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

  async getTokenList(tokenAddresses: string[]): Promise<Token[]> {
    try {
      const tokens = await this.prisma.token.findMany({
        where: {
          address: {
            in: tokenAddresses,
          },
        },
      });
      return tokens;
    } catch (error) {
      console.error('Error fetching token list:', error);
      throw error;
    }
  }
}
