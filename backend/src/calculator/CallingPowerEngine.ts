import { Call } from '@prisma/client';
import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export type CallPerformance = {
  tokenAddress: string;
  startFDV: number;
  highestFDV: number;
  createdAt: Dayjs;
  performance: number;
  temporalWeight: number;
  finalPerf: number;
};

export type CallingPowerData = {
  basePerformance: number;
  avgPerformance: number;
  correction: number;
  constancy: number;
  callingPower: number;
  normalized: number;
  performances: Array<CallPerformance>;
};

export type PowerFormula = {
  callPerformance: (call: CallPerformance) => number;
  callWeight: (call: CallPerformance) => number;
  basePerformance: (performances: CallPerformance[]) => number;
  correction: (performances: CallPerformance[]) => number;
  constancy: (performances: CallPerformance[]) => number;
  normalize: (value: number) => number;
};

export interface ICallingPowerCalculator {
  computePower(calls: Array<Call>): CallingPowerData;
}

export function callingPowerEngine(
  calls: Array<Call>,
  config: PowerFormula
): CallingPowerData {
  if (!calls || calls.length === 0) {
    return {
      basePerformance: 0,
      avgPerformance: 0,
      correction: 0,
      constancy: 0,
      callingPower: 0,
      normalized: 0,
      performances: [],
    };
  }

  // Calculate the performance of each call
  const performances = calls.map(toPerformance).map((call) => {
    call.performance = config.callPerformance(call);
    call.temporalWeight = config.callWeight(call);
    call.finalPerf = call.performance * call.temporalWeight;
    return call;
  });

  // Calculate the total performance
  const basePerformance = config.basePerformance(performances);
  const avgPerformance = average(performances);
  const correction = config.correction(performances);
  const constancy = config.constancy(performances);
  const callingPower = (basePerformance / correction) * constancy;
  const normalized = config.normalize(callingPower);
  return {
    performances,
    avgPerformance,
    basePerformance,
    correction,
    constancy,
    callingPower,
    normalized,
  };
}

export function toPerformance(call: Call): CallPerformance {
  return {
    tokenAddress: call.tokenAddress,
    startFDV: call.startFDV,
    highestFDV: call.highestFDV,
    createdAt: dayjs(call.createdAt),
    performance: 0,
    temporalWeight: 0,
    finalPerf: 0,
  };
}

// Call performance formula

export function callPerformanceDiff(call: CallPerformance): number {
  return call.highestFDV - call.startFDV;
}

export function callPerformancePercentage(call: CallPerformance): number {
  return (callPerformanceDiff(call) / call.startFDV) * 100;
}

// Call weight formula

export function noWeight(call: CallPerformance): number {
  return 1;
}

/**
 * Calculates the temporal weight for a call based on its age.
 *
 * This function uses two different formulas depending on the age of the call:
 * 1. For calls less than 24 hours old: It uses a Bernoulli series to give progressive weight.
 * 2. For calls 24 hours or older: It applies a penalty based on the age in weeks.
 *
 * Sample values:
 * 1h.   2h.   3h.   6h.   12h.  20h.  24h.  1w.   2w.   3w.   6w.   12w.
 * 0.17  0.39  0.44  0.68  0.90  0.98  1.0   0.50  0.33  0.25  0.14  0.08
 *
 * @param call - The Call object containing the creation timestamp
 * @returns A number between 0 and 1 representing the temporal weight
 */
export function temporalWeightFormula(call: CallPerformance): number {
  const ageDuration = dayjs.duration(dayjs().diff(dayjs(call.createdAt)));

  let temporalWeight: number;
  if (ageDuration.asHours() < 24) {
    // Use Bernoulli series to give progressive weight on call
    temporalWeight = 1 - Math.pow(0.01, ageDuration.asHours() / 24);
  } else {
    // Penalize older calls
    temporalWeight = 1 / (1 + ageDuration.asWeeks());
  }
  return temporalWeight;
}

// Total factor formula

export function noFactor(performances: CallPerformance[]): number {
  return 1;
}

export function logarithmicTotalFactor(
  performances: CallPerformance[]
): number {
  return 1 + Math.log(performances.length);
}

// Constancy factor formula

export function constancyFactor(performances: CallPerformance[]): number {
  // Calculer la moyenne des performances
  const averagePerformance = average(performances);

  return averagePerformance / (deviation(performances) + 1);
}

export function deviation(performances: CallPerformance[]): number {
  // Calculer la moyenne des performances
  const averagePerformance = average(performances);
  // Calculer l'écart-type des performances
  const variance =
    performances.reduce(
      (sum, perf) => sum + Math.pow(perf.finalPerf - averagePerformance, 2),
      0
    ) / performances.length;
  return Math.sqrt(variance);
}

export function average(performances: CallPerformance[]): number {
  return totalPerformance(performances) / performances.length;
}

export function totalPerformance(performances: CallPerformance[]): number {
  return performances.reduce((sum, perf) => sum + perf.finalPerf, 0);
}

export function totalWeight(performances: CallPerformance[]): number {
  return performances.reduce((sum, perf) => sum + perf.temporalWeight, 0);
}

export function successRate(performances: CallPerformance[]): number {
  // Calculer le nombre d'appels positifs
  const positiveCalls = performances.filter(
    (perf) => perf.performance > 0
  ).length;

  // Calculer le taux de réussite
  return positiveCalls / performances.length;
}

// noramlize formula

export function noNormalize(score: number): number {
  return score;
}

/**
 * Creates a function to normalize scores based on a reference score and maximum score.
 *
 * @param referenceScore - The reference score used to calculate relative scores.
 * @param maxScore - The maximum possible normalized score.
 * @param steepness - Controls the steepness of the sigmoid curve. Default is 4.
 * @param midpoint - The relative score at which the sigmoid function reaches its midpoint. Default is 0.8.
 * @returns A function that takes a raw score and returns a normalized score.
 */
export function normalizeScore(
  referenceScore: number,
  maxScore: number,
  steepness: number = 4,
  midpoint: number = 0.5
) {
  return (score: number) => {
    // Ensure the score is non-negative
    const nonNegativeScore = Math.max(0, score);

    // Calculate the relative score (score relative to the reference score)
    const relativeScore = nonNegativeScore / referenceScore;

    // Apply a modified sigmoid function to normalize the score
    // This creates an S-shaped curve that maps relative scores to normalized scores
    const normalizedScore =
      maxScore / (1 + Math.exp(-steepness * (relativeScore - midpoint)));

    // Round to the nearest integer and ensure it's within [0, maxScore]
    return Math.min(maxScore, Math.max(0, Math.round(normalizedScore)));
  };
}
