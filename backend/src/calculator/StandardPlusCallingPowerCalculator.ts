import { Call } from '@prisma/client';
import { ICallingPowerCalculator } from '@src/calculator/PowerCalculatorFactory';

export class StandardPlusCallingPowerCalculator
  implements ICallingPowerCalculator
{
  computePower(calls: Array<Call>, enableLogging: boolean = false): number {
    if (calls.length === 0) return 0;
    const now = new Date();

    // Calculer la performance de chaque appel avec un poids par défaut de 1
    const performances = calls.map((call) => {
      const ageMilliseconds = now.getTime() - call.createdAt.getTime();
      const ageHeures = ageMilliseconds / (60 * 60 * 1000);
      const ageSemaines = ageMilliseconds / (7 * 24 * 60 * 60 * 1000);

      let weight;
      if (ageHeures < 24) {
        // Utilisation de la suite de Bernoulli pour les calls de moins de 24h
        weight = 1 - Math.pow(0.5, ageHeures / 24);
      } else {
        // Pénalisation des vieux calls comme avant
        weight = 1 / (1 + ageSemaines);
      }
      return {
        performance: ((call.highestFDV - call.startFDV) / call.startFDV) * 100,
        weight: weight,
      };
    });

    // Calculer la somme des poids
    const totalWeight = performances.reduce(
      (sum, perf) => sum + perf.weight,
      0
    );

    // Calculer la moyenne pondérée des performances
    const averagePerformance =
      performances.reduce(
        (sum, perf) => sum + perf.performance * perf.weight,
        0
      ) / totalWeight;

    // Calculer l'écart-type pondéré des performances
    const variance =
      performances.reduce(
        (sum, perf) =>
          sum +
          perf.weight * Math.pow(perf.performance - averagePerformance, 2),
        0
      ) / totalWeight;
    const standardDeviation = Math.sqrt(variance);

    // Calculer le nombre d'appels positifs
    const positiveCallsCount = performances.filter(
      (perf) => perf.performance > 0
    ).length;

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
          performance: performances[index].performance.toFixed(2),
          weight: performances[index].weight,
        }))
      );
      console.log(`Number of calls: ${calls.length}`);
      console.log(`Average performance: ${averagePerformance.toFixed(2)}`);
      console.log(
        `Standard deviation: ${standardDeviation.toFixed(2)} = √(∑(weight * (performance - averagePerformance)²) / totalWeight)`
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