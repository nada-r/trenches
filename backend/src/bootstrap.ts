import { cleanEnv, str } from 'envalid';
import { PrismaClient } from '@prisma/client';
import { CallerService, CallService, TournamentService } from './services';
import { CallingPowerService } from '@src/services/CallingPowerService';

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

  const callerService = new CallerService(prisma);
  const callService = new CallService(prisma);
  const tournamentService = new TournamentService(prisma);
  const callingPowerService = new CallingPowerService(
    callerService,
    callService
  );

  return {
    callerService,
    callService,
    callingPowerService,
    tournamentService,
    prisma,
  };
}