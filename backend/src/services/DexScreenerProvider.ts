import { TokenInfo } from '@src/services/TokenRepository';
import axios, { AxiosInstance } from 'axios';

export class DexScreenerProvider {
  constructor(private axiosInstance: AxiosInstance = axios) {}

  private isRaydiumSolanaPair(tokenAddress: string, pair: any): boolean {
    return (
      pair.chainId === 'solana' &&
      pair.dexId === 'raydium' &&
      pair.baseToken.symbol === 'SOL' &&
      pair.baseToken.address === tokenAddress
    );
  }

  private mapPairToTokenInfo(pair: any): TokenInfo {
    return {
      tokenAddress: pair.baseToken.address,
      fdv: parseFloat(pair.fdv),
      symbol: pair.baseToken.symbol,
      chain: 'solana',
      url: pair.url,
      name: pair.baseToken.name,
      image_uri: pair.info.imageUrl,
      type: 'raydium',
      poolAddress: pair.pairAddress,
    };
  }

  private handleApiError(error: any): null {
    if (error.response && error.response.status === 429) {
      console.log(`429 on ${error.config.url}`);
    } else {
      console.error('Error fetching token', error);
    }
    return null;
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    try {
      const response = await this.axiosInstance.get(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      );
      const pairs = response.data.pairs;
      if (Array.isArray(pairs)) {
        const pair = pairs.find((p) =>
          this.isRaydiumSolanaPair(tokenAddress, p)
        );
        return pair ? this.mapPairToTokenInfo(pair) : null;
      } else {
        console.log('Token not found in dexscreener:', tokenAddress);
        return null;
      }
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async getPoolInfo(poolAddress: string): Promise<TokenInfo | null> {
    try {
      const response = await this.axiosInstance.get(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${poolAddress}`
      );
      const pair = response.data.pair;
      if (this.isRaydiumSolanaPair(poolAddress, pair)) {
        return this.mapPairToTokenInfo(pair);
      } else {
        console.log('Token not found in dexscreener:', poolAddress);
        return null;
      }
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}
