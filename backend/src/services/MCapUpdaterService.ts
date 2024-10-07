import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';

export type McapEntry = {
  timestamp: number;
  highest: number;
  close: number;
};

export class MCapUpdaterService {
  constructor(
    private pumpfunProvider: PumpfunProvider,
    private geckoTerminalProvider: GeckoTerminalProvider
  ) {}

  async getMcapHistory(token: {
    tokenAddress: string;
    poolAddress: string | undefined;
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

  getHighestMcap(mcapHistory: McapEntry[], after: Date): number {
    const afterTimestamp = after.getTime() / 1000;
    return (
      mcapHistory
        // keep only history after date
        .filter((entry) => entry.timestamp > afterTimestamp)
        // then find max value
        .reduce((highestMcap, entry) => Math.max(highestMcap, entry.highest), 0)
    );
  }
}
