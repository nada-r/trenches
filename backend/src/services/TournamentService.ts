import { PrismaClient, Tournament, TournamentParticipation } from '@prisma/client';
import { OmitPrisma } from '@src/types';

/**
 * TournamentService is a class that provides CRUD operations for tournaments.
 * It uses the Prisma client to interact with the database.
 */
export class TournamentService {
  constructor(
    private prisma: PrismaClient
  ) {}

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

  /**
   * Retrieves all available tournaments.
   * A tournament is considered available if its status is either 'STARTED' or 'COMPLETED'.
   * @returns A Promise that resolves to an array of Tournament objects.
   */
  async getAvailable(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({
      where: {
        status: {
          in: ['UPCOMING', 'STARTED', 'COMPLETED'],
        },
      },
    });
  }

  /**
   * Retrieves all available tournaments.
   * A tournament is considered available if its status is either 'STARTED' or 'COMPLETED'.
   * @returns A Promise that resolves to an array of Tournament objects.
   */
  async getStarted(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({
      where: {
        status: {
          in: ['STARTED'],
        },
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
        status: 'STARTED', // Set the tournament status to 'STARTED'
        startedAt: new Date(), // Set the start time to the current date and time
      },
    });
  }

  /**
   * Joins a user to a tournament by creating a new tournament participation.
   * @param data - The tournament participation data to create, excluding Prisma-specific fields.
   * @returns A Promise that resolves to the created TournamentParticipation object.
   */
  async joinTournament(data: OmitPrisma<TournamentParticipation>) {
    // TODO validate that sender is the owner of the walletPubkey by signing his message
    return this.prisma.tournamentParticipation.create({
      data: {
        ...data,
      },
    });
  }

  async endTournament(tournamentId: number) {
    return this.prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        status: 'COMPLETED', // Set the tournament status to 'STARTED'
      },
    });
  }

  async getMyTournamentParticipation(
    tournamentId: number,
    walletPubkey: string
  ): Promise<TournamentParticipation & { score: number } | null> {
    const participation = await this.prisma.tournamentParticipation.findUnique({
      where: {
        unique_participation: {
          tournamentId: tournamentId,
          walletPubkey: walletPubkey,
        },
      },
      include: {
        tournament: true,
      }

    });


    if (!participation) {
      return null;
    }

    return {

      ...participation,
      score: 0,
    };
  }

  async getAllParticipations(tournamentId: number) {

    return this.prisma.tournamentParticipation.findMany({
      where: {
        tournamentId: tournamentId,
      },
    });
  }
}

export default TournamentService;
