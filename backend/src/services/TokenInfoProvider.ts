import { TokenInfo } from '@src/services/TokenService';
import axios from 'axios';

export class TokenInfoProvider {
  async getSolanaToken(token: string): Promise<TokenInfo | null> {
    return axios
      .get(`https://api.dexscreener.com/latest/dex/tokens/${token}`)
      .then((response) => {
        if (
          response.data.pairs != null &&
          response.data.pairs.length > 0 &&
          response.data.pairs[0].chainId == 'solana'
        ) {
          const pair = response.data.pairs[0];
          let tokenInfo: TokenInfo = {
            address: pair.baseToken.address,
            fdv: parseFloat(pair.fdv),
            symbol: pair.baseToken.symbol,
            chain: 'solana',
            url: pair.url,
            name: pair.baseToken.name,
            image_uri: pair.info.imageUrl,
          };
          return tokenInfo;
        } else {
          // console.log("Token not found in dexscreener, checking pools");
          return this.getSolanaPool(token);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          console.log(`429 on ${error.config.url}`);
        } else {
          console.error('Error fetching token data:', error);
        }
        return null;
      });
  }

  async getSolanaPool(address: string): Promise<TokenInfo | null> {
    return axios
      .get(`https://api.dexscreener.com/latest/dex/pairs/solana/${address}`)
      .then((response) => {
        if (
          response.data.pairs != null &&
          response.data.pairs.length > 0 &&
          response.data.pairs[0].chainId == 'solana'
        ) {
          const pair = response.data.pairs[0];
          let tokenInfo: TokenInfo = {
            address: pair.baseToken.address,
            fdv: parseFloat(pair.fdv),
            symbol: pair.baseToken.symbol,
            chain: 'solana',
            url: pair.url,
            name: pair.baseToken.name,
            image_uri: pair.info.imageUrl,
          };
          return tokenInfo;
        } else {
          // console.log("Token not found in dexscreener pools");
          return this.getPumpfunToken(address);
          // return null;
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

  async getPumpfunToken(token: string): Promise<TokenInfo | null> {
    return axios
      .get(`https://frontend-api.pump.fun/coins/${token}`)
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
          };
          return tokenInfo;
        } else {
          // console.log("Token not found in pumpfun");
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
}
