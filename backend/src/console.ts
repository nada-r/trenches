import { select } from '@inquirer/prompts';
import bootstrap from './bootstrap';
import { addCaller } from './console/caller';
import { createTournament, startTournament } from './console/tournament';

async function main() {
  const { cardService, powerService, tournamentService } = await bootstrap();

  const answer = await select({
    message: 'Select an action',
    choices: [
      {
        name: 'add a caller',
        value: 'caller',
      },
      {
        name: 'create a tournament',
        value: 'tournament-new',
      },
      {
        name: 'start a tournament',
        value: 'tournament-start',
      },
    ],
  });

  switch (answer) {
    case 'caller':
      await addCaller(powerService, cardService);
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
