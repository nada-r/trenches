import { CallService } from '@src/services/CallService';
import { CallerService } from '@src/services/CallerService';
import { PowerCalculatorFactory } from '@src/calculator/PowerCalculatorFactory';

export class CallingPowerService {
  constructor(
    private callerService: CallerService,
    private callService: CallService,
    private powerCalculatorFactory: PowerCalculatorFactory = new PowerCalculatorFactory()
  ) {}

  async updateCallingPower(uniqueTokens: string[]): Promise<void> {
    const callers =
      await this.callerService.getCallersWithCallsOnTokens(uniqueTokens);
    for (const c of callers) {
      const calls = await this.callService.getCallsByTelegramId(c.telegramId);
      const callerPower = this.powerCalculatorFactory
        .getCalculator('premium')
        .computePower(calls);
      await this.callerService.updateCallingPower(c.telegramId, callerPower);
    }
    await this.callerService.updateCallerRanks();

    console.log(`Calling power updated for ${callers.length} callers.`);
  }

  async updateAllCallingPower(): Promise<void> {
    const callers = await this.callerService.getAll();
    for (const c of callers) {
      const calls = await this.callService.getCallsByTelegramId(c.telegramId);
      const callerPower = this.powerCalculatorFactory
        .getCalculator('premium')
        .computePower(calls);
      await this.callerService.updateCallingPower(c.telegramId, callerPower);
    }
    await this.callerService.updateCallerRanks();

    console.log(`Calling power updated for ${callers.length} callers.`);
  }
}