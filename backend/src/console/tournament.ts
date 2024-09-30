import { input, number, select } from '@inquirer/prompts';
import { TournamentService } from '@src/services';
import { TournamentStatus } from '@prisma/client';
import { EnvType } from '@src/console';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';

export async function displayTournamentActions(
  env: EnvType,
  tournamentService: TournamentService,
  tournamentResultProcessor: TournamentResultProcessor
) {
  while (true) {
    const action = await select({
      message: 'Select an action:',
      choices: [
        { name: 'Create tournament', value: 'create' },
        { name: 'Start tournament', value: 'start' },
        { name: 'Result tournament', value: 'end' },
        { name: 'Back to parent menu', value: 'back' },
      ],
    });

    switch (action) {
      case 'create':
        await createTournament(tournamentService);
        break;
      case 'start':
        await startTournament(tournamentService);
        break;
      case 'end':
        await endTournament(tournamentService, tournamentResultProcessor);
        break;
      case 'back':
        return; // Exit the function to go back to the parent menu
      default:
        console.log('Invalid action');
    }

    // Add a newline for better readability in the console
    console.log('\n');
  }
}
async function createTournament(tournamentService: TournamentService) {
  const name = await input({ message: 'Tournament name:' });
  const openDuration = await number({ message: 'Open duration (days):' });
  const endDuration = await number({ message: 'End duration (days):' });
  const tournament = {
    name: name,
    status: TournamentStatus.HIDDEN,
    metadata: {
      openDuration: openDuration ? openDuration * 24 * 60 * 60 || 0 : 0,
      endDuration: endDuration ? endDuration * 24 * 60 * 60 || 0 : 0,
      prize: (await number({ message: 'Prize (SOL):' })) || 0,
      supplyBurn: (await number({ message: 'Supply burn (%):' })) || 0,
    },
  };

  console.log('Create tournament:', tournament);
  await tournamentService.createTournament(tournament);
}

async function startTournament(tournamentService: TournamentService) {
  try {
    const tournamentId = await select({
      message: 'Enter tournament ID:',
      choices: (await tournamentService.getAll())
        .filter((t) => t.status === 'HIDDEN')
        .map((t) => ({
          name: t.name,
          value: t.id,
        })),
    });

    if (!tournamentId) {
      console.log('Please provide valid id;');
      return;
    }

    await tournamentService.startTournament(tournamentId);
    console.log(`Tournament ${tournamentId} has been started successfully.`);
  } catch (error) {
    console.error(`Failed to start tournament: ${error.message}`);
  }
}

async function endTournament(
  tournamentService: TournamentService,
  tournamentResultProcessor: TournamentResultProcessor
) {
  try {
    const tournamentId = await select({
      message: 'Enter tournament ID:',
      choices: (await tournamentService.getAll())
        .filter((t) => t.status === 'STARTED')
        .map((t) => ({
          name: t.name,
          value: t.id,
        })),
    });

    if (!tournamentId) {
      console.log('Please provide valid id;');
      return;
    }

    await tournamentResultProcessor.processResults(tournamentId);
  } catch (error) {
    console.error(`Failed to end tournament: ${error.message}`);
  }
}