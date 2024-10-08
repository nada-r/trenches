import { CallerRepository } from '@src/services/CallerRepository';
import { CallRepository } from '@src/services/CallRepository';
import { ICallingPowerCalculator } from '@src/calculator/NewCallingPowerCalculator';

export class CallingPowerService {
  constructor(
    private callerRepository: CallerRepository,
    private callRepository: CallRepository,
    private callingPowerCalculator: ICallingPowerCalculator
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
    const calls = await this.callRepository.getCallsByTelegramId(callerId);
    const callerPower = this.callingPowerCalculator.computePower(calls);
    await this.callerRepository.updateCallingPower(callerId, callerPower);
  }
}
