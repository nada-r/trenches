import { CallerRepository } from '@src/services/CallerRepository';
import { CallRepository } from '@src/services/CallRepository';
import { callingPowerEngine } from '@src/calculator/CallingPowerEngine';
import { THIRD_CALLING_POWER_CONFIG } from '@src/calculator/ThirdCallingPowerCalculator';

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

  async updateCallingPower(callerId: number): Promise<void> {
    try {
      const calls = await this.callRepository.getCallsByTelegramId(callerId);
      const callerPower = callingPowerEngine(calls, THIRD_CALLING_POWER_CONFIG);
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
