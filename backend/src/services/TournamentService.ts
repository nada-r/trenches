import { PrismaClient, Tournament } from '@prisma/client';
import { OmitPrisma } from '@src/types';

export class TournamentService {
  constructor(private prisma: PrismaClient) {}

  async createTournament(data: OmitPrisma<Tournament, 'startedAt'>) {
    data.metadata;
    return this.prisma.tournament.create({
      data: {
        ...data,
      },
    });
  }

  async getAll(): Promise<Tournament[]> {
    return this.prisma.tournament.findMany({});
  }
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

  async startTournament(tournamentId: number) {
    return this.prisma.tournament.update({
      where: {
        id: tournamentId,
      },
      data: {
        status: 'STARTED',
        startedAt: new Date(),
      },
    });
  }
}

export default TournamentService;