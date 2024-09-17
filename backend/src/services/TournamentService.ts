import { PrismaClient, Tournament, TournamentParticipation } from '@prisma/client';
import { OmitPrisma } from '@src/types';

/**
 * TournamentService is a class that provides CRUD operations for tournaments.
 * It uses the Prisma client to interact with the database.
 */
export class TournamentService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Creates a new tournament.
   * @param data - The tournament data to create, excluding the `startedAt` field.
   * @returns A Promise that resolves to the created Tournament object.
   */
  async createTournament(data: OmitPrisma<Tournament, 'startedAt'>) {
    data.metadata;
    return this.prisma.tournament.create({
      data: {
        ...data,
      },
    });
  }

  /**
   * Retrieves all tournaments.
   * @returns A Promise that resolves to an array of Tournament objects.
   */
  async getAll(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({});
  }

  /**
   * Retrieves a tournament by its ID.
   * @param id - The ID of the tournament to retrieve.
   * @returns A Promise that resolves to the Tournament object, or `null` if not found.
   */
  async getById(id: number): Promise<Tournament | null> {
    return this.prisma.tournament.findUnique({
      where: {
        id: id,
      },
    });
  }

  /**
   * Retrieves all available tournaments.
   * A tournament is considered available if its status is either 'STARTED' or 'COMPLETED'.
   * @returns A Promise that resolves to an array of Tournament objects.
   */
  async getAvailable(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({
      where: {
        OR: [
          {
            status: {
              equals: 'STARTED',
            },
          },
          {
            status: {
              equals: 'COMPLETED',
            },
          },
        ],
      },
    });
  }

  /**
   * Starts a tournament by updating its status and setting the start time.
   * @param tournamentId The ID of the tournament to start.
   * @returns A Promise that resolves to the updated Tournament object.
   */
  async startTournament(tournamentId: number) {
    return this.prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        status: 'STARTED',  // Set the tournament status to 'STARTED'
        startedAt: new Date(),  // Set the start time to the current date and time
      },
    });
  }

async joinTournament(data: OmitPrisma<TournamentParticipation>) {
  return this.prisma.tournamentParticipation.create({
    data: {
      ... data,
    },
  });
}


}

export default TournamentService;