import { confirm, number, select } from '@inquirer/prompts';
import { CallerService } from '@src/services/CallerService';
import { EnvType } from '@src/console';
import { CallingPowerService, CallService } from '@src/services';
import { PowerCalculatorFactory } from '@src/calculator/PowerCalculatorFactory';

export async function displayCallerActions(
  env: EnvType,
  callerService: CallerService,
  callService: CallService,
  callingPowerService: CallingPowerService
) {
  let actions = [
    { name: 'Explain caller power', value: 'explainCallerPower' },
    { name: 'Update caller power', value: 'updateCallerPower' },
    { name: 'Export Callers', value: 'exportCallers' },
  ];
  if (env === 'development') {
    actions = [...actions, { name: 'Import Callers', value: 'importCallers' }];
  }

  const action = await select({
    message: 'Select an action:',
    choices: actions,
  });

  switch (action) {
    case 'explainCallerPower':
      await explainCallerPower(callerService, callService);
      break;
    case 'updateCallerPower':
      await updateCallerPower(callingPowerService);
      break;
    default:
      console.log('Not yet implemented');
  }
}

const explainCallerPower = async (
  callerService: CallerService,
  callService: CallService
) => {
  const callingPowerFactory = new PowerCalculatorFactory();
  const callerId = await number({ message: 'Enter caller ID:' });

  if (callerId) {
    const caller = await callerService.getCallerWithCall(callerId);
    if (caller) {
      const calls = await callService.getCallsByTelegramId(caller.telegramId);
      callingPowerFactory?.getCalculator('standard')?.computePower(calls, true);
      callingPowerFactory?.getCalculator('premium')?.computePower(calls, true);
    }
  } else {
    const callers = await callerService.getAll();
    const results = [];

    for (const caller of callers) {
      const calls = await callService.getCallsByTelegramId(caller.telegramId);
      const standardPower = callingPowerFactory
        .getCalculator('standard')
        ?.computePower(calls);
      const standardPlusPower = callingPowerFactory
        .getCalculator('standard++')
        ?.computePower(calls);
      const premiumPower = callingPowerFactory
        .getCalculator('premium')
        ?.computePower(calls);
      results.push({
        name: caller.name,
        standardPower,
        standardPlusPower,
        premiumPower,
      });
    }

    results.sort((a, b) => b.premiumPower - a.premiumPower);

    console.table(results);
  }
};

async function updateCallerPower(callingPowerService: CallingPowerService) {
  const answer = await confirm({
    message: 'Are you sure you want to update all calling power?',
  });
  if (answer) {
    await callingPowerService.updateAllCallingPower();
  }
}
