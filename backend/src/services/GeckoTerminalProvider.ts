import axios from 'axios';

export class GeckoTerminalProvider {
  constructor() {}

  private solPriceCache: { price: number | null; timestamp: number } | null =
    null;
  private readonly CACHE_DURATION = 60000; // 1 minute in milliseconds

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
      const response = await axios.get(
        `https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/So11111111111111111111111111111111111111112`
      );
      const price =
        response.data.data.attributes.token_prices[
          'So11111111111111111111111111111111111111112'
        ];

      // Update cache
      this.solPriceCache = {
        price,
        timestamp: currentTime,
      };

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

  async getHighestMCap(tokenAddress: string): Promise<any | null> {
    try {
      const response = await axios.get(
        `https://api.geckoterminal.com/api/v2/networks/solana/pools/${tokenAddress}/ohlcv/day?aggregate=1&currency=usd`
      );

      if (response.data != null) {
        const highestPrice = response.data.data.attributes.ohlcv_list.reduce(
          (acc: number, curr: number[]) => Math.max(acc, curr[2]),
          0
        );
        return highestPrice * 1_000_000_000;
      } else {
        console.log('Token not found in geckoterminal:', tokenAddress);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      } else if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching highest price on geckoterminal:', error);
      }
      return null;
    }
  }
}