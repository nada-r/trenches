import { PrismaClient, Token } from '@prisma/client';

export interface TokenInfo {
  address: string;
  fdv: number;
  symbol: string;
  chain: string;
  name: string;
  url: string;
  image_uri: string;
}

export class TokenService {
  constructor(private prisma: PrismaClient) {}

  async createToken(tokenInfo: TokenInfo): Promise<void> {
    try {
      const token = await this.prisma.token.create({
        data: {
          address: tokenInfo.address,
          name: tokenInfo.name,
          ticker: tokenInfo.symbol,
          url: tokenInfo.url,
          image_uri: tokenInfo.image_uri,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return;
      }
      console.error('Error creating token:', error);
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
