import { Call } from '@prisma/client';
import dayjs from 'dayjs';

/**
 * @deprecated This class is no longer recommended for use.
 * Please use the updated version CallingPowerService.SECOND_CALLING_POWER_CONFIG with callingPowerEngine
 */
export class SecondCallingPowerCalculator {
  constructor() {}
  computePower(calls: Array<Call>): number {
    let globalPerformance = 0;
    let totalWeight = 0;
    const currentDate = dayjs();

    for (const call of calls) {
      // Calculate the performance
      const performance =
        ((call.highestFDV - call.startFDV) / call.startFDV) * 100;

      // Calculate the age of the call
      const callCreatedAt = dayjs(call.createdAt);
      const ageDuration = dayjs.duration(currentDate.diff(callCreatedAt));

      let temporalWeight;
      if (ageDuration.asHours() < 24) {
        // Use Bernoulli series to give progressive weight on call
        temporalWeight = 1 - Math.pow(0.5, ageDuration.asHours() / 24);
      } else {
        // or penalize older calls
        temporalWeight = 1 / (1 + ageDuration.asWeeks());
      }

      // Accumulate the weighted performance and total weight
      globalPerformance += performance * temporalWeight;
      totalWeight += temporalWeight;
    }

    // Calculate the final performance
    return totalWeight > 0 ? globalPerformance / totalWeight : 0;
  }
}