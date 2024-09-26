import { TokenInfo } from '@src/services/TokenService';
import axios from 'axios';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';

export class PumpfunProvider {
  constructor(private geckoTerminalProvider: GeckoTerminalProvider) {}

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    return axios
      .get(`https://frontend-api.pump.fun/coins/${tokenAddress}`)
      .then((response) => {
        if (response.data != null && response.data.mint) {
          let address = response.data.mint;
          let tokenInfo: TokenInfo = {
            address: address,
            fdv: parseFloat(response.data.usd_market_cap),
            symbol: response.data.symbol,
            name: response.data.name,
            chain: 'solana',
            url: `https://pump.fun/${address}`,
            image_uri: response.data.image_uri,
            type: 'pumpfun',
            poolAddress: response.data.raydium_pool,
          };
          return tokenInfo;
        } else {
          console.log('Token not found in pumpfun:', tokenAddress);
          return null;
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          console.log(`429 on ${error.config.url}`);
        } else {
          console.error('Error fetching token', error);
        }
        return null;
      });
  }

  async getHighestMCap(tokenAddress: string): Promise<number | null> {
    try {
      const response = await axios.get(
        `https://frontend-api.pump.fun/candlesticks/${tokenAddress}?offset=0&limit=1000&timeframe=5`
      );
      if (response.data != null && Array.isArray(response.data)) {
        const highestPrice = response.data.reduce(
          (acc, curr) => Math.max(acc, curr.high),
          0.0
        );
        const sol_to_dollar = await this.geckoTerminalProvider.getSolPrice();
        if (!sol_to_dollar) {
          return null;
        }

        return highestPrice * 1_000_000_000.0 * sol_to_dollar;
      } else {
        console.log('Token not found on pumpfun:', tokenAddress);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token highest price', error);
      }
      return null;
    }
  }
}