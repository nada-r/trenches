import { CallerRepository } from '@src/services/CallerRepository';
import { CallRepository } from '@src/services/CallRepository';
import {
  callingPowerEngine,
  callPerformancePercentage,
  constancyFactor,
  logarithmicTotalFactor,
  noFactor,
  noNormalize,
  noWeight,
  successRate,
  temporalWeightFormula,
  totalPerformance,
  totalWeight,
} from '@src/calculator/CallingPowerEngine';

export const FIRST_CALLING_POWER_CONFIG = {
  callPerformance: callPerformancePercentage,
  callWeight: noWeight,
  basePerformance: successRate,
  correction: noFactor,
  constancy: constancyFactor,
  normalize: noNormalize,
};

export const SECOND_CALLING_POWER_CONFIG = {
  callPerformance: callPerformancePercentage,
  callWeight: temporalWeightFormula,
  basePerformance: totalPerformance,
  correction: totalWeight,
  constancy: noFactor,
  normalize: noNormalize,
};

export const THIRD_CALLING_POWER_CONFIG = {
  callPerformance: callPerformancePercentage,
  callWeight: temporalWeightFormula,
  basePerformance: totalPerformance,
  correction: logarithmicTotalFactor,
  constancy: noFactor,
  normalize: noNormalize,
};

export class CallingPowerService {
  constructor(
    private callerRepository: CallerRepository,
    private callRepository: CallRepository
  ) {}

  async updateCallingPowerFor(uniqueTokens: string[]): Promise<void> {
    const callers =
      await this.callerRepository.getCallersWithCallsOnTokens(uniqueTokens);
    for (const caller of callers) {
      await this.updateCallingPower(caller.id);
    }

    console.log(`Calling power updated for ${callers.length} callers.`);
  }

  async updateAllCallingPower(): Promise<void> {
    const callers = await this.callerRepository.getAll();
    for (const caller of callers) {
      await this.updateCallingPower(caller.id);
    }

    console.log(`Calling power updated for ${callers.length} callers.`);
  }

  private engineConfig = THIRD_CALLING_POWER_CONFIG;

  async updateCallingPower(callerId: number): Promise<void> {
    try {
      const calls = await this.callRepository.getCallsByTelegramId(callerId);
      const callerPower = callingPowerEngine(calls, this.engineConfig);
      await this.callerRepository.updateCallingPower(
        callerId,
        callerPower.normalized
      );
    } catch (error) {
      console.error(
        `Error updating calling power for caller ${callerId}:`,
        error.message
      );
    }
  }
}
