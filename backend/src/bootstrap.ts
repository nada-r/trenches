import { cleanEnv, str } from 'envalid';
import { PrismaClient } from '@prisma/client';
import {
  CallerService,
  CallingPowerService,
  CallService,
  ProfileService,
  TournamentScoreService,
  TournamentService,
} from './services';
import 'dotenv/config';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { TokenService } from '@src/services/TokenService'; // ES 2015

// Make sure all the Envs are loaded when launching the server
// add the new env under envVariables
function validateEnv() {
  cleanEnv(process.env, {
    DATABASE_URL: str(),
  });
}

export default async function bootstrap() {
  validateEnv();
  dayjs.extend(duration);
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
  const callingPowerService = new CallingPowerService(
    callerService,
    callService
  );
  const tournamentScoreService = new TournamentScoreService(
    callerService,
    callService,
    prisma
  );
  const tournamentService = new TournamentService(
    tournamentScoreService,
    prisma
  );
  const profileService = new ProfileService(prisma);
  const tokenService = new TokenService(prisma);

  return {
    callerService,
    callService,
    callingPowerService,
    profileService,
    tournamentService,
    tokenService,
    prisma,
  };
}