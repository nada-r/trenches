import { Call } from '@prisma/client';
import { PremiumCallingPowerCalculator } from '@src/calculator/PremiumCallingPowerCalculator';
import { StandardCallingPowerCalculator } from '@src/calculator/StandardCallingPowerCalculator';
import { StandardPlusCallingPowerCalculator } from '@src/calculator/StandardPlusCallingPowerCalculator';

export type PowerCalculator = 'standard' | 'standard++' | 'premium';

export interface ICallingPowerCalculator {
  computePower(calls: Array<Call>, enableLogging?: boolean): number;
}

export class PowerCalculatorFactory {
  private calculators: Map<PowerCalculator, ICallingPowerCalculator>;

  constructor() {
    this.calculators = new Map<PowerCalculator, ICallingPowerCalculator>();
    this.calculators.set('standard', new StandardCallingPowerCalculator());
    this.calculators.set(
      'standard++',
      new StandardPlusCallingPowerCalculator()
    );
    this.calculators.set('premium', new PremiumCallingPowerCalculator());
  }

  getCalculator(identifier: PowerCalculator): ICallingPowerCalculator {
    return <ICallingPowerCalculator>this.calculators.get(identifier);
  }
}
