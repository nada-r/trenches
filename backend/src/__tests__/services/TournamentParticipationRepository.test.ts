import { PrismaClient, TournamentParticipation } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { createParticipation } from '@src/__tests__/utils';
import { TournamentParticipationRepository } from '@src/services/TournamentParticipationRepository';

describe('TournamentParticipationRepository', () => {
  let prisma: DeepMockProxy<PrismaClient>;
  let participationRepository: TournamentParticipationRepository;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    participationRepository = new TournamentParticipationRepository(prisma);
  });

  describe('joinTournament', () => {
    it('should create a tournament participation', async () => {
      // given
      const mockParticipation: TournamentParticipation = createParticipation(
        1,
        '0x123',
        ['1', '2', '3']
      );
      prisma.tournamentParticipation.create.mockResolvedValue(
        mockParticipation
      );

      // when
      const result = await participationRepository.joinTournament({
        tournamentId: 1,
        walletPubkey: 'wallet123',
        callers: ['1', '2', '3'],
        data: {},
      });

      // then
      expect(result).toEqual(mockParticipation);
    });
  });

  describe('getMyTournamentParticipation', () => {
    it('should return tournament participation with score', async () => {
      // given
      const mockParticipation: TournamentParticipation = createParticipation(
        1,
        '0x123',
        ['1', '2', '3']
      );
      prisma.tournamentParticipation.findUnique.mockResolvedValue(
        mockParticipation
      );

      // when
      const result = await participationRepository.getMyTournamentParticipation(
        1,
        '0x123'
      );

      // then
      expect(result).toEqual({ ...mockParticipation, score: 0 });
    });

    it('should return null if participation is not found', async () => {
      prisma.tournamentParticipation.findUnique.mockResolvedValue(null);

      const result = await participationRepository.getMyTournamentParticipation(
        1,
        'wallet123'
      );

      expect(result).toBeNull();
    });
  });

  describe('getAllParticipations', () => {
    it('should return all participations for a tournament', async () => {
      // given
      const participation1 = createParticipation(
        1,
        '0x123',
        ['1', '2', '3'],
        1
      );
      const participation2 = createParticipation(
        2,
        '0x123',
        ['1', '2', '3'],
        1
      );

      prisma.tournamentParticipation.findMany.mockResolvedValue([
        participation1,
        participation2,
      ]);

      // when
      const result = await participationRepository.getAllParticipations(1);

      // then
      expect(result).toEqual([participation1, participation2]);
    });
  });
});
