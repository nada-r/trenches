import { Call } from '@prisma/client';
import { ICallingPowerCalculator } from '@src/calculator/PowerCalculatorFactory';

export class PremiumCallingPowerCalculator implements ICallingPowerCalculator {
  computePower(calls: Array<Call>, enableLogging: boolean = false): number {
    let performanceGlobale = 0;
    let poidsTotal = 0;
    const dateActuelle = new Date();

    console.log('Starting calculation for calls:');

    for (const call of calls) {
      const ratioPerformance =
        ((call.highestFDV - call.startFDV) / call.startFDV) * 100;
      const ageMilliseconds = dateActuelle.getTime() - call.createdAt.getTime();
      const ageHeures = ageMilliseconds / (60 * 60 * 1000);
      const ageSemaines = ageMilliseconds / (7 * 24 * 60 * 60 * 1000);

      let multiplicateurTemporel;
      if (ageHeures < 24) {
        // Utilisation de la suite de Bernoulli pour les calls de moins de 24h
        multiplicateurTemporel = 1 - Math.pow(0.5, ageHeures / 24);
      } else {
        // Pénalisation des vieux calls comme avant
        multiplicateurTemporel = 1 / (1 + ageSemaines);
      }
      const scoreCall = ratioPerformance * multiplicateurTemporel;
      const poids = multiplicateurTemporel; // Le poids diminue avec le temps

      performanceGlobale += scoreCall * poids;
      poidsTotal += poids;

      if (enableLogging) {
        console.log(`Call details:
        Ratio Performance: ${ratioPerformance.toFixed(4)}
        Age (hours): ${ageHeures.toFixed(2)}
        Multiplicateur Temporel: ${multiplicateurTemporel.toFixed(4)}
        Score Call: ${scoreCall.toFixed(4)}
        Poids: ${poids.toFixed(4)}
      `);
      }
    }

    const performanceFinale =
      poidsTotal > 0 ? performanceGlobale / poidsTotal : 0;

    if (enableLogging) {
      console.log(`
      Calculation summary:
      Performance Globale: ${performanceGlobale.toFixed(4)}
      Poids Total: ${poidsTotal.toFixed(4)}
      Performance Finale: ${performanceFinale.toFixed(4)}
    `);

      console.log(
        `Caller power: ${performanceFinale.toFixed(2)} = ${performanceGlobale.toFixed(4)} / ${poidsTotal.toFixed(4)}`
      );
    }
    return performanceFinale;
  }
}