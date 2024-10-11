import { Call } from '@prisma/client';

/**
 * @deprecated This class is no longer recommended for use.
 * Please use the updated version CallingPowerService.FIRST_CALLING_POWER_CONFIG with callingPowerEngine
 */
export class FirstCallingPowerCalculator {
  constructor() {}

  public computePower(calls: Array<Call>): number {
    if (calls.length === 0) return 0;
    // Calculer la performance de chaque call
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
