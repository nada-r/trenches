import { PrismaClient } from '@prisma/client';
import { CallerRepository } from '@src/services/CallerRepository';
import { TournamentRepository } from '@src/services/TournamentRepository';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { createCaller, createParticipation } from '@src/__tests__/utils';

describe('TournamentResultProcessor', () => {
  let processor: TournamentResultProcessor;
  let prisma: DeepMockProxy<PrismaClient>;
  let callerRepository: DeepMockProxy<CallerRepository>;
  let tournamentRepository: DeepMockProxy<TournamentRepository>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
    callerRepository = mockDeep<CallerRepository>();
    tournamentRepository = mockDeep<TournamentRepository>();

    processor = new TournamentResultProcessor(
      callerRepository,
      tournamentRepository,
      prisma
    );
  });

  it('should process tournament results correctly', async () => {
    // given
    const tournamentId = 1;
    const mockCallers = [
      createCaller(1, '1', 'User1', { power: 100 }),
      createCaller(2, '2', 'User2', { power: 200 }),
      createCaller(3, '3', 'User3', { power: 300 }),
    ];
    const mockParticipations = [
      createParticipation(1, '0x1', 1, ['1', '2']),
      createParticipation(2, '0x2', 1, ['2', '3']),
      createParticipation(3, '0x3', 1, ['1', '3']),
    ];

    callerRepository.getAll.mockResolvedValue(mockCallers);
    tournamentRepository.getAllParticipations.mockResolvedValue(
      mockParticipations
    );

    // when
    await processor.processResults(tournamentId);

    // then
    // Check if tournamenCallerPower.createMany was called with correct data
    expect(prisma.tournamenCallerPower.createMany).toHaveBeenCalledWith({
      data: [
        { callerId: 1, power: 100, tournamentId },
        { callerId: 2, power: 200, tournamentId },
        { callerId: 3, power: 300, tournamentId },
      ],
    });

    // Check if tournamentParticipation.update was called for each participation
    expect(prisma.tournamentParticipation.update).toHaveBeenCalledTimes(3);
    expect(prisma.tournamentParticipation.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { data: { score: 500, rank: 1 } },
    });
    expect(prisma.tournamentParticipation.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { data: { score: 400, rank: 2 } },
    });
    expect(prisma.tournamentParticipation.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { data: { score: 300, rank: 3 } },
    });

    // Check if endTournament was called
    expect(tournamentRepository.endTournament).toHaveBeenCalledWith(
      tournamentId
    );
  });
});
