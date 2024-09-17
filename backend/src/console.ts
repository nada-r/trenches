import { select } from '@inquirer/prompts';
import bootstrap from './bootstrap';
import { addCaller, importCallers } from './console/caller';
import { createTournament, startTournament } from './console/tournament';

async function main() {
  const { callerService, tournamentService } = await bootstrap();

  const answer = await select({
    message: 'Select an action',
    choices: [
      {
        name: 'create a tournament',
        value: 'tournament-new',
      },
      {
        name: 'start a tournament',
        value: 'tournament-start',
      },
      {
        name: 'add a caller',
        value: 'caller-add',
      },
      {
        name: 'import callers',
        value: 'caller-import',
      },
    ],
  });

  switch (answer) {
    case 'caller-add':
      await addCaller(callerService);
      break;
    case 'caller-import':
      await importCallers(callerService);
      break;
    case 'tournament-new':
      await createTournament(tournamentService);
      break;
    case 'tournament-start':
      await startTournament(tournamentService);
      break;
    default:
      // Handle default case or leave empty if no default action is needed
      break;
  }
}

main().catch((e) => console.error('!Unhandled error in main:', e));
