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
      const calls = await this.callRepository.getCallsByTelegramId(
        caller.telegramId
      );
      const callerPower = this.callingPowerCalculator.computePower(calls);
      await this.callerRepository.updateCallingPower(
        caller.telegramId,
        callerPower
      );
    }
    await this.callerRepository.updateCallerRanks();

    console.log(`Calling power updated for ${callers.length} callers.`);
  }

  async updateAllCallingPower(): Promise<void> {
    const callers = await this.callerRepository.getAll();
    for (const c of callers) {
      const calls = await this.callRepository.getCallsByTelegramId(
        c.telegramId
      );
      const callerPower = this.callingPowerCalculator.computePower(calls);
      await this.callerRepository.updateCallingPower(c.telegramId, callerPower);
    }
    await this.callerRepository.updateCallerRanks();

    console.log(`Calling power updated for ${callers.length} callers.`);
  }

  async updateCallingPower(telegramId: string): Promise<void> {
    const calls = await this.callRepository.getCallsByTelegramId(telegramId);
    const callerPower = this.callingPowerCalculator.computePower(calls);
    await this.callerRepository.updateCallingPower(telegramId, callerPower);

    await this.callerRepository.updateCallerRanks();
  }
}
