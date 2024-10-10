import axios, { AxiosInstance } from 'axios';
import { McapEntry } from '@src/services/MCapUpdaterService';

export class GeckoTerminalProvider {
  private solPriceCache: { price: number | null; timestamp: number } | null =
    null;
  private readonly CACHE_DURATION = 60000; // 1 minute in milliseconds

  constructor(private axiosInstance: AxiosInstance = axios) {}

  async getSolPrice(): Promise<number | null> {
    const currentTime = Date.now();

    // Check if cache exists and is still valid
    if (
      this.solPriceCache &&
      currentTime - this.solPriceCache.timestamp < this.CACHE_DURATION
    ) {
      return this.solPriceCache.price;
    }

    try {
      const response = await this.axiosInstance.get(
        `https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/So11111111111111111111111111111111111111112`
      );
      const price =
        response.data.data.attributes.token_prices[
          'So11111111111111111111111111111111111111112'
        ];

      // Update cache
      this.solPriceCache = { price, timestamp: currentTime };
      return price;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching SOL price:', error);
      }
      return null;
    }
  }

  async getTokenMCapHistory(
    tokenAddress: string
  ): Promise<Array<McapEntry> | null> {
    try {
      const response = await this.axiosInstance.get(
        `https://api.geckoterminal.com/api/v2/networks/solana/pools/${tokenAddress}/ohlcv/minute?aggregate=1&currency=usd&limit=1000`
      );

      if (response.data) {
        return response.data.data.attributes.ohlcv_list
          .map((data: number[]) => {
            const C = data[4];
            return {
              timestamp: data[0],
              close: C * 1_000_000_000,
            };
          })
          .reverse();
      } else {
        console.log('Token history not found in geckoterminal:', tokenAddress);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      } else if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token history on geckoterminal:', error);
      }
      return null;
    }
  }
}
