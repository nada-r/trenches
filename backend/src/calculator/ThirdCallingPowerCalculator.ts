import { Call } from '@prisma/client';
import {
  CallingPowerData,
  callingPowerEngine,
  callPerformancePercentage,
  ICallingPowerCalculator,
  logarithmicTotalFactor,
  noFactor,
  noNormalize,
  temporalWeightFormula,
  totalPerformance,
} from '@src/calculator/CallingPowerEngine';

export const THIRD_CALLING_POWER_CONFIG = {
  callPerformance: callPerformancePercentage,
  callWeight: temporalWeightFormula,
  basePerformance: totalPerformance,
  correction: logarithmicTotalFactor,
  constancy: noFactor,
  normalize: noNormalize,
};

export class ThirdCallingPowerCalculator implements ICallingPowerCalculator {
  constructor() {}

  computePower(calls: Array<Call>): CallingPowerData {
    return callingPowerEngine(calls, THIRD_CALLING_POWER_CONFIG);
  }
}
