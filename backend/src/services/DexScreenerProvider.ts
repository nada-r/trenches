import { TokenInfo } from '@src/services/TokenService';
import axios from 'axios';

export class DexScreenerProvider {
  constructor() {}

  private isRaydiumSolanaPair(tokenAddress: string, pair: any): boolean {
    return (
      pair.chainId == 'solana' &&
      pair.dexId === 'raydium' &&
      pair.baseToken.symbol === 'SOL' &&
      pair.baseToken.address === tokenAddress
    );
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
      );
      const pairs = response.data.pairs;
      if (Array.isArray(pairs)) {
        const pair = pairs.find((p) =>
          this.isRaydiumSolanaPair(tokenAddress, p)
        );

        if (pair) {
          return {
            address: pair.baseToken.address,
            fdv: parseFloat(pair.fdv),
            symbol: pair.baseToken.symbol,
            chain: 'solana',
            url: pair.url,
            name: pair.baseToken.name,
            image_uri: pair.info.imageUrl,
            type: 'raydium',
            poolAddress: pair.pairAddress,
          };
        } else {
          return null;
        }
      } else {
        console.log('Token not found in pumpfun:', tokenAddress);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token', error);
      }
      return null;
    }
  }

  async getPoolInfo(tokenAddress: string): Promise<TokenInfo | null> {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${tokenAddress}`
      );
      const pair = response.data.pair;
      if (this.isRaydiumSolanaPair(tokenAddress, pair)) {
        return {
          address: pair.baseToken.address,
          fdv: parseFloat(pair.fdv),
          symbol: pair.baseToken.symbol,
          chain: 'solana',
          url: pair.url,
          name: pair.baseToken.name,
          image_uri: pair.info.imageUrl,
          type: 'raydium',
          poolAddress: pair.pairAddress,
        };
      } else {
        console.log('Token not found in pumpfun:', tokenAddress);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token', error);
      }
      return null;
    }
  }
}