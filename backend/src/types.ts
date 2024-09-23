declare global {
  namespace PrismaJson {
    type CallerData = { power?: number; rank?: number };
    type ProfileData = { favorites: number[] };
    type TournamentMetadata = {
      openDuration: number;
      endDuration: number;
      prize: number;
      supplyBurn: number;
    };
    type ClaimMetadata = Array<{ callerId: number; balance: number }>;
  }
}

export type OmitPrisma<T, K extends keyof T = never> = Omit<
  T,
  K | 'id' | 'createdAt' | 'updatedAt'
>;
