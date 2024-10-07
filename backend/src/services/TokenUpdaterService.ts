import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { TokenInfo, TokenRepository } from '@src/services/TokenRepository';
import { CallRepository } from '@src/services/CallRepository';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider';

export class TokenUpdaterService {
  constructor(
    private pumpfunProvider: PumpfunProvider,
    private dexScreenerProvider: DexScreenerProvider,
    private tokenRepository: TokenRepository,
    private callRepository: CallRepository
  ) {}

  // Function to find and update token info from different providers and store it in the database
  public async findAndUpdateTokenInfo(
    tokenAddress: string
  ): Promise<TokenInfo | null> {
    // 1. Try to get token info from Pumpfun provider
    let tokenInfo = await this.pumpfunProvider.getTokenInfo(tokenAddress);

    if (!tokenInfo) {
      // 2. If address is not a pump token, try to get token info from DexScreener provider
      tokenInfo = await this.dexScreenerProvider.getTokenInfo(tokenAddress);

      if (!tokenInfo) {
        // 3. If address still not found, it is probably not a token, but a paired token in a pool
        tokenInfo = await this.dexScreenerProvider.getPoolInfo(tokenAddress);
      }
    }

    // 4. If token info is found, update or create it in the database
    if (tokenInfo) {
      await this.tokenRepository.createOrUpdateToken(tokenInfo);
    }

    return tokenInfo;
  }

  public async findAndUpdateTokenPool(tokenAddress: string) {
    const tokenInfo = await this.pumpfunProvider.getTokenInfo(tokenAddress);
    if (tokenInfo && tokenInfo.poolAddress) {
      // update token table in database to store poolAddress
      await this.tokenRepository.createOrUpdateToken(tokenInfo);

      // update call table in database to store poolAddress
      await this.callRepository.updateCallTokenPoolAddress(
        tokenAddress,
        tokenInfo.poolAddress
      );

      return tokenInfo.poolAddress;
    }
  }
}
