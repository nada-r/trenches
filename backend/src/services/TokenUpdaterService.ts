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
      await this.tokenRepository.createOrUpdateToken(tokenInfo);
    }

    return tokenInfo;
  }
}
