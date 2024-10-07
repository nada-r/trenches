import { input, number, select } from '@inquirer/prompts';
import { TournamentStatus } from '@prisma/client';
import { EnvType } from '@src/console';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';
import { TournamentRepository } from '@src/services/TournamentRepository';

type TournamentActionsDependencies = {
  tournamentRepository: TournamentRepository;
  tournamentResultProcessor: TournamentResultProcessor;
};

export async function displayTournamentActions(
  env: EnvType,
  dependencies: TournamentActionsDependencies
) {
  while (true) {
    const action = await select({
      message: 'Select an action:',
      choices: [
        { name: 'Create tournament', value: 'create' },
        { name: 'Start tournament', value: 'start' },
        { name: 'Result tournament', value: 'end' },
        { name: '< Back', value: 'back' },
      ],
    });

    switch (action) {
      case 'create':
        await createTournament(dependencies);
        break;
      case 'start':
        await startTournament(dependencies);
        break;
      case 'end':
        await endTournament(dependencies);
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

const createTournament = async (
  dependencies: TournamentActionsDependencies
) => {
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
  await dependencies.tournamentRepository.createTournament(tournament);
};

const startTournament = async (dependencies: TournamentActionsDependencies) => {
  const { tournamentRepository } = dependencies;
  try {
    const tournamentId = await select({
      message: 'Enter tournament ID:',
      choices: (await tournamentRepository.getAll())
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

    await tournamentRepository.startTournament(tournamentId);
    console.log(`Tournament ${tournamentId} has been started successfully.`);
  } catch (error) {
    console.error(`Failed to start tournament: ${error.message}`);
  }
};

const endTournament = async (dependencies: TournamentActionsDependencies) => {
  const { tournamentRepository, tournamentResultProcessor } = dependencies;

  try {
    const tournamentId = await select({
      message: 'Enter tournament ID:',
      choices: (await tournamentRepository.getAll())
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
};
