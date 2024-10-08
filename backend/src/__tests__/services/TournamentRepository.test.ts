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
        const mockTournaments = [
          createTournament(1, 'UPCOMING'),
          createTournament(2, 'STARTED'),
          createTournament(3, 'COMPLETED'),
        ];
        prisma.tournament.findMany.mockResolvedValue(mockTournaments);

        // when
        const result = await tournamentRepository.getAll();

        // then
        expect(result).toEqual(mockTournaments);
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

    describe('getAvailable', () => {
      it('should return available tournaments', async () => {
        // given
        const mockTournaments = [
          createTournament(1, 'UPCOMING'),
          createTournament(2, 'STARTED'),
          createTournament(3, 'COMPLETED'),
        ];
        prisma.tournament.findMany.mockResolvedValue(mockTournaments);

        // when
        const result = await tournamentRepository.getAvailable();

        // then
        expect(result).toEqual(mockTournaments);
      });
    });

    describe('getStarted', () => {
      it('should return started tournaments', async () => {
        // given
        const mockTournaments = [createTournament(1, 'STARTED')];
        prisma.tournament.findMany.mockResolvedValue(mockTournaments);

        // when
        const result = await tournamentRepository.getStarted();

        // then
        expect(result).toEqual(mockTournaments);
      });
    });
  });

  describe('Administration', () => {
    describe('createTournament', () => {
      it('should create a new tournament', async () => {
        // given
        const mockTournament = createTournament(1, 'UPCOMING');
        prisma.tournament.create.mockResolvedValue(mockTournament);

        const tournament = {
          name: mockTournament.name,
          status: mockTournament.status,
          metadata: mockTournament.metadata,
        };

        // when
        const result = await tournamentRepository.createTournament(tournament);

        // then
        expect(result).toEqual(mockTournament);
      });
    });

    describe('startTournament', () => {
      it('should start a tournament', async () => {
        // given
        const mockTournament = createTournament(1, 'STARTED');
        prisma.tournament.update.mockResolvedValue(mockTournament);

        // when
        const result = await tournamentRepository.startTournament(1);

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
