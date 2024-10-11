import { Call } from '@prisma/client';
import {
  CallingPowerData,
  callingPowerEngine,
  callPerformancePercentage,
  constancyFactor,
  ICallingPowerCalculator,
  noFactor,
  noNormalize,
  noWeight,
  successRate,
} from '@src/calculator/CallingPowerEngine';

export const FIRST_CALLING_POWER_CONFIG = {
  callPerformance: callPerformancePercentage,
  callWeight: noWeight,
  basePerformance: successRate,
  correction: noFactor,
  constancy: constancyFactor,
  normalize: noNormalize,
};

export class FirstCallingPowerCalculator implements ICallingPowerCalculator {
  constructor() {}

  computePower(calls: Array<Call>): CallingPowerData {
    return callingPowerEngine(calls, FIRST_CALLING_POWER_CONFIG);
  }

  // ORIGINAL IMPLEMENTATION BELOW, PRODUCE SAME RESULT

  /*public computePower(
    calls: Array<Call>,
  ): number {
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
  }*/
}
