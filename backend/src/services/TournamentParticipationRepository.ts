import { PrismaClient, TournamentParticipation } from '@prisma/client';
import { OmitPrisma } from '@src/types';

/**
 * TournamentService is a class that provides CRUD operations for tournaments.
 * It uses the Prisma client to interact with the database.
 */
export class TournamentParticipationRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Joins a user to a tournament by creating a new tournament participation.
   * @param data - The tournament participation data to create, excluding Prisma-specific fields.
   * @returns A Promise that resolves to the created TournamentParticipation object.
   */
  async joinTournament(
    data: OmitPrisma<TournamentParticipation>
  ): Promise<TournamentParticipation> {
    // TODO validate that sender is the owner of the walletPubkey by signing his message
    return this.prisma.tournamentParticipation.create({
      data: {
        ...data,
      },
    });
  }

  async getMyTournamentParticipation(
    tournamentId: number,
    walletPubkey: string
  ): Promise<(TournamentParticipation & { score: number }) | null> {
    const participation = await this.prisma.tournamentParticipation.findUnique({
      where: {
        unique_participation: {
          tournamentId: tournamentId,
          walletPubkey: walletPubkey,
        },
      },
      include: {
        tournament: true,
      },
    });

    if (!participation) {
      return null;
    }

    return {
      ...participation,
      score: 0,
    };
  }

  async getAllParticipations(
    tournamentId: number
  ): Promise<TournamentParticipation[]> {
    return this.prisma.tournamentParticipation.findMany({
      where: {
        tournamentId: tournamentId,
      },
    });
  }

}
