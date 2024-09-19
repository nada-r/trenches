import { Call } from '@prisma/client';
import { CallService } from '@src/services/CallService';
import { CallerService } from '@src/services/CallerService';

export class CallingPowerService {
  constructor(
    private callerService: CallerService,
    private callService: CallService
  ) {}

  async updateCallingPower(): Promise<void> {
    const callers = await this.callerService.getAll();
    for (const c of callers) {
      const calls = await this.callService.getCallsByTelegramId(c.telegramId);
      const callerPower = this.calculateCallerPower(calls);
      await this.callerService.updateCallingPower(c.telegramId, callerPower);
    }
  }

  calculateCallerPower(calls: Array<Call>): number {
    if (calls.length === 0) return 0;

    // Calculer la performance de chaque appel
    const performances = calls.map((call) => {
      return ((call.highestFDV - call.startFDV) / call.startFDV) * 100;
    });

    // Calculer la moyenne des performances
    const averagePerformance =
      performances.reduce((sum, perf) => sum + perf, 0) / performances.length;

    // Calculer l'écart-type des performances
    const variance =
      performances.reduce(
        (sum, perf) => sum + Math.pow(perf - averagePerformance, 2),
        0
      ) / performances.length;
    const standardDeviation = Math.sqrt(variance);

    // Calculer le nombre d'appels positifs
    const positiveCallsCount = performances.filter((perf) => perf > 0).length;

    // Calculer le taux de réussite
    const successRate = positiveCallsCount / calls.length;

    // Calculer le pouvoir de l'appelant
    // Vous pouvez ajuster cette formule selon vos besoins spécifiques
    const callerPower =
      (averagePerformance * successRate) / (standardDeviation + 1);

    return callerPower;
  }
}