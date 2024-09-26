import axios from 'axios';

export class GeckoTerminalProvider {
  constructor() {}

  async getSolPrice(): Promise<number | null> {
    {
      try {
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/simple/networks/solana/token_price/So11111111111111111111111111111111111111112`
        );
        return response.data.data.attributes.token_prices[
          'So11111111111111111111111111111111111111112'
        ];
      } catch (error) {
        console.error('Error fetching SOL price:', error);
        return null;
      }
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