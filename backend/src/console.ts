import { confirm, select } from '@inquirer/prompts';
import bootstrap from './bootstrap';
import { displayCallerActions } from './console/caller';
import { displayTournamentActions } from './console/tournament';
import * as process from 'node:process';
import { displayTokenActions } from '@src/console/token';

export type EnvType = 'production' | 'development';

async function main() {
  const dependencies = await bootstrap();
  const env = getEnvFromDotenvKey();

  while (true) {
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
        {
          name: 'Token',
          value: 'token',
        },
        {
          name: 'Quit',
          value: 'quit',
        },
      ],
    });

    switch (answer) {
      case 'caller':
        await displayCallerActions({ ...dependencies, env });
        break;
      case 'tournament':
        await displayTournamentActions({ ...dependencies, env });
        break;
      case 'token':
        await displayTokenActions({ ...dependencies, env });
        break;
      case 'quit':
        return;
      default:
        // Handle default case or leave empty if no default action is needed
        break;
    }
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
    if (process.env.DATABASE_URL?.includes('localhost')) {
      console.error(
        'Production Env is used, but DATABASE_URL is set to localhost'
      );
      process.exit(1);
    }

    console.warn('###########################################');
    console.warn('!!!! Production Env is used, be careful !!!!');
    console.warn('###########################################');
  }
  return envValue;
}

export async function bodyguard(env: EnvType) {
  if (env === 'production') {
    console.warn('###########################################');
    console.warn('!!!! Production Env is used, be careful !!!!');
    console.warn('###########################################');

    if (
      !(await confirm({
        message: 'Production Env is used, are you sure to update database ?',
      }))
    ) {
      console.error('Safety first, action cancelled');
      process.exit(1);
    }
  }
}

main().catch((e) => console.error('!Unhandled error in main:', e));
