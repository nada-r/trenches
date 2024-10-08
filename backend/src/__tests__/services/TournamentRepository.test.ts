import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TournamentRepository } from '@src/services/TournamentRepository';
import { createTournament } from '@src/__tests__/utils';

describe('TournamentRepository', () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let tournamentRepository: TournamentRepository;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    tournamentRepository = new TournamentRepository(prisma);
  });

  describe('Tournament access', () => {
    describe('getAll', () => {
      it('should return all tournaments', async () => {
        // given
        const mockTournament1 = createTournament(2, 'STARTED');
        const mockTournament2 = createTournament(3, 'COMPLETED');
        prisma.tournament.findMany.mockResolvedValue([
          mockTournament1,
          mockTournament2,
        ]);

        // when
        const result = await tournamentRepository.getAll();

        // then
        expect(result).toEqual([mockTournament1, mockTournament2]);
      });
    });

    describe('getById', () => {
      it('should return a tournament with participation count', async () => {
        // given
        const mockTournament = createTournament(1, 'STARTED');
        prisma.tournament.findUnique.mockResolvedValue(mockTournament);
        prisma.tournamentParticipation.count.mockResolvedValue(5);

        // when
        const result = await tournamentRepository.getById(1);

        // then
        expect(result).toEqual({ ...mockTournament, participationCount: 5 });
      });

      it('should return null if tournament is not found', async () => {
        // given
        prisma.tournament.findUnique.mockResolvedValue(null);

        // when
        const result = await tournamentRepository.getById(999);

        // then
        expect(result).toBeNull();
      });
    });
  });

  describe('Administration', () => {
    describe('createTournament', () => {
      it('should create a new tournament', async () => {
        // given
        const mockTournament = createTournament(1, 'STARTED');
        prisma.tournament.create.mockResolvedValue(mockTournament);

        const tournament = {
          name: mockTournament.name,
          startedAt: mockTournament.startedAt,
          metadata: mockTournament.metadata,
        };

        // when
        const result = await tournamentRepository.createTournament(tournament);

        // then
        expect(result).toEqual(mockTournament);
      });
    });

    describe('endTournament', () => {
      it('should end a tournament', async () => {
        // given
        const mockTournament = createTournament(1, 'COMPLETED');
        prisma.tournament.update.mockResolvedValue(mockTournament);

        // when
        const result = await tournamentRepository.endTournament(1);

        // then
        expect(result).toEqual(mockTournament);
      });
    });
  });
});
