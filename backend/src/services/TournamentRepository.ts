import { PrismaClient, Tournament, TournamentStatus } from '@prisma/client';
import { OmitPrisma } from '@src/types';

/**
 * TournamentService is a class that provides CRUD operations for tournaments.
 * It uses the Prisma client to interact with the database.
 */
export class TournamentRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Retrieves all available tournaments.
   * A tournament is considered available if its status is either 'STARTED' or 'COMPLETED'.
   * @returns A Promise that resolves to an array of Tournament objects.
   */
  async getAll(statuses:TournamentStatus[] = ['STARTED', 'COMPLETED'] ): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({
      where: {
        status: {
          in: statuses,
        },
      },
    });
  }

  /**
   * Retrieves a tournament by its ID.
   * @param id - The ID of the tournament to retrieve.
   * @returns A Promise that resolves to the Tournament object, or `null` if not found.
   */
  async getById(
    id: number
  ): Promise<(Tournament & { participationCount: number }) | null> {
    const tournament = await this.prisma.tournament.findUnique({
      where: {
        id: id,
      },
    });

    if (!tournament) {
      return null;
    }

    const participationCount = await this.prisma.tournamentParticipation.count({
      where: {
        tournamentId: id,
      },
    });

    return {
      ...tournament,
      participationCount,
    };
  }

  // ADMINISTRATION

  /**
   * Creates a new tournament.
   * @param data - The tournament data to create, excluding the `startedAt` field.
   * @returns A Promise that resolves to the created Tournament object.
   */
  async createTournament(
    data: OmitPrisma<Tournament, 'status'>
  ): Promise<Tournament> {
    return this.prisma.tournament.create({
      data: {
        ...data,
      },
    });
  }

  async endTournament(tournamentId: number): Promise<Tournament> {
    return this.prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        status: 'COMPLETED', // Set the tournament status to 'STARTED'
      },
    });
  }
}
