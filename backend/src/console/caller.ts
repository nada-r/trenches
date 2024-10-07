import { confirm, number, select } from '@inquirer/prompts';
import { CallerRepository } from '@src/services/CallerRepository';
import { EnvType } from '@src/console';
import { CallRepository } from '@src/services/CallRepository';
import { CallingPowerService } from '@src/services/CallingPowerService';
import { ICallingPowerCalculator } from '@src/calculator/NewCallingPowerCalculator';

type CallerActionDependencies = {
  callerRepository: CallerRepository;
  callRepository: CallRepository;
  callingPowerService: CallingPowerService;
  callingPowerCalculator: ICallingPowerCalculator;
};

export async function displayCallerActions(
  env: EnvType,
  dependencies: CallerActionDependencies
) {
  let actions = [
    { name: 'Explain caller power', value: 'explainCallerPower' },
    { name: 'Update caller power', value: 'updateCallerPower' },
    { name: 'Export Callers', value: 'exportCallers' },
  ];

  while (true) {
    const action = await select({
      message: 'Select an action:',
      choices: actions,
    });

    switch (action) {
      case 'explainCallerPower':
        await explainCallerPower(dependencies);
        break;
      case 'updateCallerPower':
        await updateCallerPower(dependencies);
        break;
      default:
        console.log('Not yet implemented');
    }
  }
}

const explainCallerPower = async (dependencies: CallerActionDependencies) => {
  const { callerRepository, callRepository, callingPowerCalculator } =
    dependencies;

  const callerId = await number({ message: 'Enter caller ID:' });

  if (callerId) {
    const caller = await callerRepository.getCallerWithCall(callerId);
    if (caller) {
      const calls = await callRepository.getCallsByTelegramId(
        caller.telegramId
      );
      callingPowerCalculator.computePower(calls, true);
    }
  } else {
    const callers = await callerRepository.getAll();
    const results = [];

    for (const caller of callers) {
      const calls = await callRepository.getCallsByTelegramId(
        caller.telegramId
      );
      const power24h = callingPowerCalculator.computePower(
        calls.filter(
          (c) => c.createdAt < new Date(Date.now() - 24 * 60 * 60 * 1000)
        )
      );
      const power12h = callingPowerCalculator.computePower(
        calls.filter(
          (c) => c.createdAt < new Date(Date.now() - 12 * 60 * 60 * 1000)
        )
      );
      const powerNow = callingPowerCalculator.computePower(calls);
      results.push({
        name: caller.name,
        power24h,
        power12h,
        powerNow,
      });
    }

    results.sort((a, b) => b.powerNow - a.powerNow);

    console.table(results);
  }
};

const updateCallerPower = async (dependencies: CallerActionDependencies) => {
  const { callerRepository, callingPowerService } = dependencies;

  const callerId = await number({ message: 'Enter caller ID:' });

  if (callerId) {
    const caller = await callerRepository.getCallerWithCall(callerId);
    if (caller) {
      await callingPowerService.updateCallingPower(caller.telegramId);
    }
  } else {
    const answer = await confirm({
      message: 'Are you sure you want to update all calling power?',
    });
    if (answer) {
      await callingPowerService.updateAllCallingPower();
    }
  }
};
