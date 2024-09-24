import { PrismaClient, Tournament, TournamentParticipation } from '@prisma/client';
import dayjs from 'dayjs';
import { CallerService } from '@src/services/CallerService';
import { CallService } from '@src/services/CallService';
import { PowerCalculatorFactory } from '../calculator/PowerCalculatorFactory';

/**
 * TournamentService is a class that provides CRUD operations for tournaments.
 * It uses the Prisma client to interact with the database.
 */
export class TournamentScoreService {
  constructor(
    private callerService: CallerService,
    private callService: CallService,
    private prisma: PrismaClient,
    private powerCalculatorFactory: PowerCalculatorFactory = new PowerCalculatorFactory()
  ) {}

  async updateCallerPowers(tournament: Tournament): Promise<void> {
    const callers = await this.callerService.getAll();

    const start = dayjs(tournament.startedAt);
    const end = start
      .add(tournament.metadata.endDuration, 'second')
      .subtract(1, 'day');

    for (const caller of callers) {
      const power = await this.getCallerPowerAt(
        caller.telegramId,
        start.toDate(),
        end.toDate()
      );

      await this.prisma.tournamenCallerPower.upsert({
        where: {
          power_by_tournament: {
            callerId: caller.id,
            tournamentId: tournament.id,
          },
        },
        update: { power: power },
        create: {
          callerId: caller.id,
          power: power,
          tournamentId: tournament.id,
        },
      });
    }
  }

  async getCallerPower(
    tournament: Tournament,
    telegramId: string
  ): Promise<number> {
    const start = dayjs(tournament.startedAt);
    const end = start
      .add(tournament.metadata.endDuration, 'second')
      .subtract(1, 'day');

    return this.getCallerPowerAt(telegramId, start.toDate(), end.toDate());
  }

  private async getCallerPowerAt(
    telegramId: string,
    start?: Date,
    end?: Date
  ): Promise<number> {
    const calls = await this.callService.getCallsByTelegramId(
      telegramId,
      start,
      end
    );
    return this.powerCalculatorFactory
      .getCalculator('standard')
      .computePower(calls);
  }

  // async updatePlayerScores(tournamentId: number): Promise<void> {
  //   const playerBets = await this.(tournamentId);
  //   const rankings = await this.calculatePlayerRankings(playerBets);
  //
  //   for (let i = 0; i < rankings.length; i++) {
  //     const { playerId, score } = rankings[i];
  //     await this.prisma.playerScore.upsert({
  //       where: {
  //         playerId_tournamentId: {
  //           playerId: playerId,
  //           tournamentId: tournamentId,
  //         },
  //       },
  //       update: { score: score, rank: i + 1 },
  //       create: {
  //         playerId: playerId,
  //         score: score,
  //         rank: i + 1,
  //         tournamentId: tournamentId,
  //       },
  //     });
  //   }
  // }

  async getPlayerScore(
    tournament: Tournament,
    participation: TournamentParticipation
  ): Promise<number> {
    const start = dayjs(tournament.startedAt);
    const end = start
      .add(tournament.metadata.endDuration, 'second')
      .subtract(1, 'day');

    let playerScore = 0;
    for (const caller of participation.callers) {
      playerScore += await this.getCallerPowerAt(
        caller,
        start.toDate(),
        end.toDate()
      );
    }

    return playerScore;
  }

  // async calculatePlayerRankings(playerBets: PlayerBet[]): Promise<PlayerScore[]> {
  //   const callerPowers = await this.getAllCallerPowers();
  //
  //   const playerScores = playerBets.map(bet => {
  //     const score = this.calculatePlayerScore(bet, callerPowers);
  //     return { playerId: bet.playerId, score };
  //   });
  //
  //   return playerScores.sort((a, b) => b.score - a.score);
  // }
  //
  // private async getAllCallerPowers(): Promise<Map<string, number>> {
  //   const callers = await this.callerService.getAllCallers();
  //   const callerPowers = new Map<string, number>();
  //
  //   for (const caller of callers) {
  //   const calls = await this.callService.getCallsByTelegramId(caller.telegramId);
  //   const power = this.computePower(calls);
  //   callerPowers.set(caller.telegramId, power);
  // }
  //
  // return callerPowers;
  // }
  //
  // private calculatePlayerScore(bet: PlayerBet, callerPowers: Map<string, number>): number {
  //   return bet.callerBets.reduce((score, callerBet) => {
  //     const callerPower = callerPowers.get(callerBet.callerId) || 0;
  //     return score + (callerPower * callerBet.weight);
  //   }, 0);
  // }
}

export default TournamentScoreService;
