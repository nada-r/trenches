declare global {
  namespace PrismaJson {
    type CallData = {
      source: TokenSource,
      fdv?: CallMetric;
      mcap?: CallMetric;
      price?: CallMetric;
    };
    type TournamentMetadata = {
      openDuration: number;
      endDuration: number;
      prize: number;
      supplyBurn: number;
    };
    type ClaimMetadata = Array<{ callerId: number; balance: number }>;
  }
}

export type CallData = PrismaJson.CallData;

export type TokenSource = 'dexscreener' | 'dexscreener-pool' | 'pumpfun';

export type TokenInfo = {
  address: string;
  fdv: number;
  mcap?: number;
  price?: number;
  symbol: string;
  chain: string;
  source: TokenSource
}

export type CallMetric = {
  start: number;
  highest: number;
  final: number;
  history: number[];
};

export type OmitPrisma<T, K extends keyof T = never> = Omit<
  T,
  K | 'id' | 'createdAt' | 'updatedAt'
>;
