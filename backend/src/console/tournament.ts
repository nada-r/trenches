import { input, number, select } from '@inquirer/prompts';
import { EnvType } from '@src/console';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';
import { TournamentRepository } from '@src/services/TournamentRepository';
import dayjs from 'dayjs';

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
        { name: 'Create new tournament', value: 'create' },
        { name: '< Back', value: 'back' },
      ],
    });

    switch (action) {
      case 'create':
        await createTournament(dependencies);
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
  const startedAt = await input({ message: 'Started at (YYYY-MM-DD HH:mm):' });
  const openDuration = await number({
    message: 'Participation duration (in days since start):',
  });
  const endDuration = await number({
    message: 'Finish duration (in days since start):',
  });

  const parsedDate = dayjs(startedAt);
  if (!parsedDate.isValid()) {
    console.log('Error: Invalid date format. Please use YYYY-MM-DD HH:mm');
    return;
  }

  if (parsedDate.isBefore(dayjs())) {
    console.log('Error: Tournament start date cannot be in the past');
    return;
  }

  if (openDuration === endDuration) {
    console.log(
      'Error: Finish duration must be greater than participation duration'
    );
    return;
  }

  const tournament = {
    name,
    startedAt: parsedDate.toDate(),
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
