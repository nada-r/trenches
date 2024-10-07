import { TokenInfo, TokenMcap } from '@src/services/TokenRepository';
import axios, { AxiosInstance } from 'axios';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';

export class PumpfunProvider {
  constructor(
    private geckoTerminalProvider: GeckoTerminalProvider,
    private axiosInstance: AxiosInstance = axios
  ) {}

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
    return this.axiosInstance
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
        } /*else {
          console.error(
            `Error ${error.response.status} fetching token:`,
            tokenAddress
          );
          console.error(`On url: ${error.config.url}`);
        }*/
        return null;
      });
  }

  async getTokenMCap(tokenAddress: string): Promise<TokenMcap | null> {
    try {
      const response = await this.axiosInstance.get(
        `https://frontend-api.pump.fun/candlesticks/${tokenAddress}?offset=0&limit=1000&timeframe=5`
      );
      if (response.data != null && Array.isArray(response.data)) {
        const highestPrice = response.data.reduce(
          (acc, curr) => Math.max(acc, curr.high),
          0.0
        );
        const lastPrice = response.data[response.data.length - 1].close;
        const sol_to_dollar = await this.geckoTerminalProvider.getSolPrice();
        if (!sol_to_dollar) {
          return null;
        }

        return {
          mcap: lastPrice * 1_000_000_000.0 * sol_to_dollar,
          highest: highestPrice * 1_000_000_000.0 * sol_to_dollar,
        };
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

  async getTokenMCapHistory(tokenAddress: string): Promise<Array<{
    timestamp: number;
    highest: number;
    close: number;
  }> | null> {
    try {
      const response = await this.axiosInstance.get(
        `https://frontend-api.pump.fun/candlesticks/${tokenAddress}?offset=0&limit=1000&timeframe=5`
      );
      if (response.data != null && Array.isArray(response.data)) {
        const sol_to_dollar = await this.geckoTerminalProvider.getSolPrice();
        if (!sol_to_dollar) {
          return null;
        }

        return response.data.map((candle) => ({
          timestamp: candle.timestamp,
          highest: candle.high * 1_000_000_000.0 * sol_to_dollar,
          close: candle.close * 1_000_000_000.0 * sol_to_dollar,
        }));
      } else {
        console.log('Token not found on pumpfun:', tokenAddress);
        return null;
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token mcap history', error);
      }
      return null;
    }
  }
}
