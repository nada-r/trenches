import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider';
import { TokenInfo, TokenService } from '@src/services/TokenService';

export class TokenUpdaterService {
  constructor(
    private pumpfunProvider: PumpfunProvider,
    private dexScreenerProvider: DexScreenerProvider,
    private tokenService: TokenService
  ) {}

  async findAndUpdateTokenInfo(
    tokenAddress: string
  ): Promise<TokenInfo | null> {
    let tokenInfo = await this.pumpfunProvider.getTokenInfo(tokenAddress);

    if (!tokenInfo) {
      tokenInfo = await this.dexScreenerProvider.getTokenInfo(tokenAddress);

      if (!tokenInfo) {
        tokenInfo = await this.dexScreenerProvider.getPoolInfo(tokenAddress);
      }
    }

    // Store token info in the database
    if (tokenInfo) {
      await this.tokenService.createOrUpdateToken(tokenInfo);
    }

    return tokenInfo;
  }
}
