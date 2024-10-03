declare global {
  namespace PrismaJson {
    type CallerData = { power?: number; rank?: number; tokenAddress?: string};
    type CallData = { poolAddress?: string };
    type TokenData = { type: string; poolAddress?: string, mcap:number };
    type ProfileData = { favorites: number[] };
    type TournamentMetadata = {
      openDuration: number;
      endDuration: number;
      prize: number;
      supplyBurn: number;
    };
    type TournamentParticipationData = { score?: number; rank?: number };
    type ClaimMetadata = Array<{ callerId: number; balance: number }>;
  }
}

export type OmitPrisma<T, K extends keyof T = never> = Omit<
  T,
  K | 'id' | 'createdAt' | 'updatedAt'
>;
