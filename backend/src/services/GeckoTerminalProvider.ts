import axios, { AxiosInstance } from 'axios';
import { TokenMcap } from '@src/services/TokenRepository';
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

  private normalizeHighestPrice(entry: number[]): number {
    const high = entry[2];
    const close = entry[4];
    // if highest is 50% higher than close, use close instead
    //tend toward 1 to ger the value of close in a candle
    return close / high < 0.66 ? close : high;
  }

  async getTokenMCap(tokenAddress: string): Promise<TokenMcap | null> {
    const history = await this.getTokenMCapHistory(tokenAddress);

    if (history) {
      const highestPrice = history.reduce(
        (acc: number, curr: McapEntry) => Math.max(acc, curr.highest),
        0
      );
      const lastPrice = history[history.length - 1].close;
      return {
        mcap: lastPrice,
        highest: highestPrice,
      };
    } else {
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
            const normalizedHigh = this.normalizeHighestPrice(data);
            return {
              timestamp: data[0],
              highest: normalizedHigh * 1_000_000_000,
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
