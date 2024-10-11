import { confirm, number, select } from '@inquirer/prompts';
import { CallerRepository } from '@src/services/CallerRepository';
import { bodyguard, EnvType } from '@src/console';
import { CallRepository } from '@src/services/CallRepository';
import {
  CallingPowerService,
  FIRST_CALLING_POWER_CONFIG,
  SECOND_CALLING_POWER_CONFIG,
  THIRD_CALLING_POWER_CONFIG,
} from '@src/services/CallingPowerService';
import {
  CallingPowerData,
  callingPowerEngine,
  callPerformancePercentage,
  logarithmicTotalFactor,
  noFactor,
  normalizeScore,
  temporalWeightFormula,
  totalPerformance,
} from '@src/calculator/CallingPowerEngine';

type CallerActionDependencies = {
  callerRepository: CallerRepository;
  callRepository: CallRepository;
  callingPowerService: CallingPowerService;
  env: EnvType;
};

export async function displayCallerActions(
  dependencies: CallerActionDependencies
) {
  let actions = [
    { name: 'Explain caller power', value: 'explainCallerPower' },
    { name: 'Update caller power', value: 'updateCallerPower' },
    { name: '< Back', value: 'back' },
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
      case 'back':
        return; // Exit the function to go back to the parent menu
      default:
        console.log('Not yet implemented');
    }
  }
}

const explainCallerPower = async (dependencies: CallerActionDependencies) => {
  const { callerRepository, callRepository } = dependencies;

  const callerId = await number({
    message: 'Enter caller ID (leave empty for all):',
  });

  if (callerId) {
    const calls = await callRepository.getCallsByTelegramId(callerId);
    logCallingPowerCalculation(
      callingPowerEngine(calls, FIRST_CALLING_POWER_CONFIG),
      'FIRST_IMPLEM'
    );
    logCallingPowerCalculation(
      callingPowerEngine(calls, SECOND_CALLING_POWER_CONFIG),
      'SECOND_IMPLEM'
    );
    logCallingPowerCalculation(
      callingPowerEngine(calls, THIRD_CALLING_POWER_CONFIG),
      'THIRD_IMPLEM'
    );
  } else {
    const callers = await callerRepository.getAll();

    const logs = [];
    for (const caller of callers) {
      const calls = await callRepository.getCallsByTelegramId(caller.id);
      const power1 = callingPowerEngine(calls, FIRST_CALLING_POWER_CONFIG);
      const power2 = callingPowerEngine(calls, SECOND_CALLING_POWER_CONFIG);
      const power3 = callingPowerEngine(calls, THIRD_CALLING_POWER_CONFIG);
      const power4 = callingPowerEngine(calls, {
        callPerformance: callPerformancePercentage,
        callWeight: temporalWeightFormula,
        basePerformance: totalPerformance,
        correction: logarithmicTotalFactor,
        constancy: noFactor,
        normalize: normalizeScore(8000, 2500, 5, 0.8),
      });
      logs.push({
        id: caller.id,
        name: caller.name,
        first: power1.normalized,
        second: power2.normalized,
        third: power3.normalized,
        fourth: power4.callingPower,
        fourthNorm: power4.normalized,
      });
    }
    console.table(logs.sort((p1, p2) => p2.third - p1.third));
  }
};

function logCallingPowerCalculation(data: CallingPowerData, type: string) {
  console.log('Calculation details:', type);
  console.log('Calls:');
  //console.table(data.performances);
  console.log(`Number of calls: ${data.performances.length}`);
  console.log(`Avg performance: ${data.avgPerformance}`);
  console.log(`Base performance: ${data.basePerformance.toFixed(2)}`);
  console.log(
    `Corrected performance: ${(data.basePerformance / data.correction).toFixed(2)}`
  );
  console.log(`Constancy: ${data.constancy.toFixed(2)}`);
  console.log(`Calling power: ${data.callingPower.toFixed(2)}`);
}

const updateCallerPower = async (dependencies: CallerActionDependencies) => {
  const { callerRepository, callingPowerService } = dependencies;

  const callerId = await number({
    message: 'Enter caller ID (leave empty for all):',
  });
  
  // DO NOT REMOVE
  await bodyguard(dependencies.env);

  if (callerId) {
    await callingPowerService.updateCallingPower(callerId);
  } else {
    const answer = await confirm({
      message: 'Are you sure you want to update all calling power?',
    });
    if (answer) {
      await callingPowerService.updateAllCallingPower();
    }
  }
  await callerRepository.updateCallerRanks();
};
