import { input, number, select } from '@inquirer/prompts';
import { bodyguard, EnvType } from '@src/console';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';
import { TournamentRepository } from '@src/services/TournamentRepository';
import dayjs from 'dayjs';

type TournamentActionsDependencies = {
  tournamentRepository: TournamentRepository;
  tournamentResultProcessor: TournamentResultProcessor;
  env: EnvType;
};

export async function displayTournamentActions(
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
  const defaultOpeningDuration = 2;
  const defaultWaitingDuration = 2;
  const defaultPrize = 0;
  const defaultSupplyBurn = 0;

  const name = await input({ message: 'Tournament name:' });
  const startedAt = await input({
    message: 'Started at (YYYY-MM-DD HH:mm) UTC:',
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

  const openingDuration =
    (await number({
      message: 'Participation duration (in days):',
      default: defaultOpeningDuration,
    })) || defaultOpeningDuration;

  const waitingDuration =
    (await number({
      message: 'Finish duration (in days):',
      default: defaultWaitingDuration,
    })) || defaultWaitingDuration;

  const prizeInput =
    (await number({ message: 'Prize (SOL):', default: defaultPrize })) ||
    defaultPrize;
  const supplyBurnInput =
    (await number({
      message: 'Supply burn (%):',
      default: defaultSupplyBurn,
    })) || defaultSupplyBurn;

  const DAYS = 24 * 60 * 60;
  const openSeconds = openingDuration! * DAYS;
  const endSeconds = (openingDuration! + waitingDuration!) * DAYS;

  console.log('Tournament details:');
  console.log(`Name: ${name}`);
  console.log(`Start date: ${parsedDate.format('YYYY-MM-DD HH:mm')} UTC`);
  console.log(
    `Participate until: ${parsedDate.add(openSeconds, 'seconds').format('YYYY-MM-DD HH:mm')} UTC`
  );
  console.log(
    `Closing date: ${parsedDate.add(endSeconds, 'seconds').format('YYYY-MM-DD HH:mm')} UTC`
  );

  // DO NOT REMOVE
  await bodyguard(dependencies.env);

  const tournament = {
    name,
    startedAt: parsedDate.toDate(),
    metadata: {
      openDuration: openSeconds,
      endDuration: endSeconds,
      prize: prizeInput || defaultPrize,
      supplyBurn: supplyBurnInput || defaultSupplyBurn,
    },
  };

  console.log('Create tournament:', tournament);
  await dependencies.tournamentRepository.createTournament(tournament);
};
