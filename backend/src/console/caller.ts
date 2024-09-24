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
      const power24h = callingPowerFactory
        .getCalculator('premium')
        ?.computePower(
          calls.filter(
            (c) => c.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)
          )
        );
      const power18h = callingPowerFactory
        .getCalculator('premium')
        ?.computePower(
          calls.filter(
            (c) => c.createdAt < new Date(Date.now() - 18 * 60 * 60 * 1000)
          )
        );
      const power12h = callingPowerFactory
        .getCalculator('premium')
        ?.computePower(
          calls.filter(
            (c) => c.createdAt < new Date(Date.now() - 12 * 60 * 60 * 1000)
          )
        );
      const power6h = callingPowerFactory
        .getCalculator('premium')
        ?.computePower(
          calls.filter(
            (c) => c.createdAt < new Date(Date.now() - 6 * 60 * 60 * 1000)
          )
        );
      const powerNow = callingPowerFactory
        .getCalculator('premium')
        ?.computePower(calls);
      results.push({
        name: caller.name,
        power24h,
        power18h,
        power12h,
        power6h,
        powerNow,
      });
    }

    results.sort((a, b) => b.powerNow - a.powerNow);

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
