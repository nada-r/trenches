import { PrismaClient } from '@prisma/client';
import { CallerRepository } from '@src/services/CallerRepository';
import { TournamentRepository } from '@src/services/TournamentRepository';
import { TournamentParticipationRepository } from '@src/services/TournamentParticipationRepository';

export class TournamentResultProcessor {
  constructor(
    private callerRepository: CallerRepository,
    private tournamentRepository: TournamentRepository,
    private tournamentParticipationRepository: TournamentParticipationRepository,
    private prisma: PrismaClient
  ) {}

  async processResults(tournamentId: number): Promise<void> {
    // first store current calling power to dedicated table
    const allCallers = await this.callerRepository.getAll();

    const tournamentCallingPowers = allCallers.map((caller) => ({
      callerId: caller.id,
      power: caller.data.power || 0,
      tournamentId: tournamentId,
    }));

    await this.prisma.tournamenCallerPower.createMany({
      data: tournamentCallingPowers,
    });

    // then compute player ranking based on their participation
    const participations =
      await this.tournamentParticipationRepository.getAllParticipations(
        tournamentId
      );

    // 1. update participation score and ranking
    for (const participation of participations) {
      participation.data.score = allCallers
        .filter((caller) =>
          participation.callers.includes(caller.id.toString())
        )
        .reduce((acc, caller) => acc + (caller.data.power || 0), 0);
    }

    // 2. update participation ranking
    participations.sort((a, b) => (b.data.score || 0) - (a.data.score || 0));
    for (const [index, participation] of participations.entries()) {
      participation.data.rank = index + 1;
      await this.prisma.tournamentParticipation.update({
        where: {
          id: participation.id,
        },
        data: {
          data: participation.data,
        },
      });
    }

    // 3. end tournament
    await this.tournamentRepository.endTournament(tournamentId);
  }
}
