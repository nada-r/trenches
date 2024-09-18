import { cleanEnv, str } from 'envalid';
import { PrismaClient } from '@prisma/client';
import {
  CardService,
  PowerService,
  UserService,
  TournamentService,
  CallService,
  CallerService,
} from './services';

// Make sure all the Envs are loaded when launching the server
// add the new env under envVariables
function validateEnv() {
  cleanEnv(process.env, {
    DATABASE_URL: str(),
  });
}

export default async function bootstrap() {
  validateEnv();
  const prisma = new PrismaClient();
  // Show connection status
  const isConnected = await prisma
    .$connect()
    .then(() => true)
    .catch(() => false);
  console.log(
    '!Prisma connection status:',
    isConnected ? 'Connected' : 'Not Connected'
  );

  const cardService = new CardService(prisma);
  const powerService = new PowerService(prisma);
  const userService = new UserService(prisma);
  const tournamentService = new TournamentService(prisma);
  const callService = new CallService(prisma);
  const callerService = new CallerService(prisma);

  return {
    cardService,
    powerService,
    userService,
    tournamentService,
    callService,
    callerService,
    prisma,
  };
}
