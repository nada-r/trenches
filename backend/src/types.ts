declare global {
  namespace PrismaJson {
    type TournamentMetadata = { openDuration: number; endDuration: number; prize: number, supplyBurn: number }
  }
}

export type OmitPrisma<T, K extends keyof T = never> = Omit<T, K | 'id' | 'createdAt' | 'updatedAt'>;
