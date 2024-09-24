import { select } from '@inquirer/prompts';
import bootstrap from './bootstrap';
import { displayCallerActions } from './console/caller';
import { displayTournamentActions } from './console/tournament';
import * as process from 'node:process';

export type EnvType = 'production' | 'development';

async function main() {
  const { callerService, callService, callingPowerService, tournamentService } =
    await bootstrap();
  const env = getEnvFromDotenvKey();

  const answer = await select({
    message: 'Select a category',
    choices: [
      {
        name: 'Tournaments',
        value: 'tournament',
      },
      {
        name: 'Caller',
        value: 'caller',
      },
    ],
  });

  switch (answer) {
    case 'caller':
      await displayCallerActions(
        env,
        callerService,
        callService,
        callingPowerService
      );
      break;
    case 'tournament':
      await displayTournamentActions(env, tournamentService);
      break;
    default:
      // Handle default case or leave empty if no default action is needed
      break;
  }
}

function getEnvFromDotenvKey(): EnvType {
  const dotenvKey = process.env.DOTENV_KEY;
  if (!dotenvKey) {
    console.error('DOTENV_KEY is not set');
    process.exit(1);
  }

  const match = dotenvKey.match(/environment=([^&]+)/);
  if (!match) {
    console.error('Invalid DOTENV_KEY format');
    process.exit(1);
  }

  const envValue = match[1];
  if (envValue !== 'production' && envValue !== 'development') {
    console.error(
      `Invalid environment value: ${envValue}. Expected 'production' or 'development'`
    );
    process.exit(1);
  }

  if (envValue === 'production') {
    console.warn('###########################################');
    console.warn('!!!! Production DB is used, be careful !!!!');
    console.warn('###########################################');
  }
  return envValue;
}

main().catch((e) => console.error('!Unhandled error in main:', e));
