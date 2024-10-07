import { Call } from '@prisma/client';
import { ICallingPowerCalculator } from '@src/calculator/NewCallingPowerCalculator';

export class OldCallingPowerCalculator implements ICallingPowerCalculator {
  constructor() {}

  public computePower(
    calls: Array<Call>,
    enableLogging: boolean = false
  ): number {
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

    if (enableLogging) {
      console.log('Calculation details:');
      console.log('Calls:');
      console.table(
        calls.map((call, index) => ({
          tokenAddress: call.tokenAddress,
          startFDV: call.startFDV,
          finishFDV: call.highestFDV,
          createdAt: call.createdAt,
          performance: performances[index].toFixed(2),
        }))
      );
      console.log(`Number of calls: ${calls.length}`);
      console.log(`Average performance: ${averagePerformance.toFixed(2)}`);
      console.log(
        `Standard deviation: ${standardDeviation.toFixed(2)} = √(∑(performance - averagePerformance)² / n)`
      );
      console.log(`Positive calls: ${positiveCallsCount}`);
      console.log(`Success rate: ${successRate.toFixed(2)}`);
      console.log(
        `Caller power: ${callerPower.toFixed(2)} = (averagePerformance * successRate) / (standardDeviation + 1)`
      );
    }

    return callerPower;
  }
}
