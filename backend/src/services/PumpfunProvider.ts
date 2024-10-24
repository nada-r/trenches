import { TokenInfo } from '@src/services/TokenRepository';
import axios, { AxiosInstance } from 'axios';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { McapEntry } from '@src/services/MCapUpdaterService';

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
            tokenAddress: address,
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

  async getTokenMCapHistory(
    tokenAddress: string
  ): Promise<Array<McapEntry> | null> {
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
