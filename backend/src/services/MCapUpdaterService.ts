import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { TokenMcap } from '@src/services/TokenRepository';

export type McapEntry = {
  timestamp: number;
  close: number;
};

export class MCapUpdaterService {
  constructor(
    private pumpfunProvider: PumpfunProvider,
    private geckoTerminalProvider: GeckoTerminalProvider
  ) {}

  async getMcapHistory(token: {
    tokenAddress: string;
    poolAddress?: string;
  }): Promise<McapEntry[] | null> {
    let mcapHistory;
    //if poolAddress already in DB (pump address that is out of the bonding curve)
    if (token.poolAddress) {
      mcapHistory = await this.geckoTerminalProvider.getTokenMCapHistory(
        token.poolAddress
      );
    }
    //if it is an address is not a pump one (example BONK)
    if (!mcapHistory && !token.tokenAddress.endsWith('pump')) {
      mcapHistory = await this.geckoTerminalProvider.getTokenMCapHistory(
        token.tokenAddress
      );
    }
    //if not on gecko terminal, alsmot sure it is a pump token, but does not end up in 'pump', look on pump
    if (!mcapHistory) {
      mcapHistory = await this.pumpfunProvider.getTokenMCapHistory(
        token.tokenAddress
      );
    }

    return mcapHistory;
  }

  getHighestMcap(mcapHistory: McapEntry[], after: Date): TokenMcap {
    const afterTimestamp = after.getTime() / 1000;
    // keep only history after date
    const afterHistory = mcapHistory.filter(
      (entry) => entry.timestamp > afterTimestamp
    );
    // then find max value
    const highestPrice = afterHistory.reduce(
      (highestMcap, entry) => Math.max(highestMcap, entry.close),
      0
    );
    const lastPrice =
      afterHistory.length > 0 ? afterHistory[afterHistory.length - 1].close : 0;
    return {
      mcap: lastPrice,
      highest: highestPrice,
    };
  }
}
