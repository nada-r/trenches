import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';

export class FdvUpdaterService {
  constructor(
    private geckoTerminalProvider: GeckoTerminalProvider,
    private pumpfunProvider: PumpfunProvider
  ) {}

  async getHighestFDV(token: string): Promise<number | null> {
    if (!token.endsWith('pump')) {
      const geckoFDV = await this.geckoTerminalProvider.getHighestMCap(token);
      if (geckoFDV) return geckoFDV;
    }
    return await this.pumpfunProvider.getHighestMCap(token);
  }
}