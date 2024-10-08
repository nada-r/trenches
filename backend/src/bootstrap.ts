import { cleanEnv, str } from 'envalid';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { TokenRepository } from '@src/services/TokenRepository';
import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider';
import axios from 'axios';
import axiosRetry, { retryAfter } from 'axios-retry';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';
import { CallingPowerService } from '@src/services/CallingPowerService';
import { ProfileRepository } from '@src/services/ProfileRepository';
import { TokenUpdaterService } from '@src/services/TokenUpdaterService';
import { CallerRepository } from '@src/services/CallerRepository';
import { CallRepository } from '@src/services/CallRepository';
import { TournamentRepository } from '@src/services/TournamentRepository';
import { MCapUpdaterService } from '@src/services/MCapUpdaterService';
import { NewCallingPowerCalculator } from '@src/calculator/NewCallingPowerCalculator';
import { TournamentParticipationRepository } from '@src/services/TournamentParticipationRepository';

// Make sure all the Envs are loaded when launching the server
// add the new env under envVariables
function validateEnv(envkeys: Record<string, any>): void {
  cleanEnv(process.env, envkeys);
}

export default async function bootstrap() {
  validateEnv({
    DATABASE_URL: str(),
    PINATA_JWT: str(),
    GATEWAY_URL: str(),
  });
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

  axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryNumber = 0, error) => {
      const calculatedDelay = 2 ** retryNumber * 1000;
      const delay = Math.max(calculatedDelay, retryAfter(error));
      const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
      return delay + randomSum;
    },
    retryCondition: (error) => error.response?.status === 429,
  });

  const geckoTerminalProvider = new GeckoTerminalProvider();
  const dexScreenerProvider = new DexScreenerProvider();
  const pumpfunProvider = new PumpfunProvider(geckoTerminalProvider);

  const callerRepository = new CallerRepository(prisma);
  const callRepository = new CallRepository(prisma);
  const tournamentRepository = new TournamentRepository(prisma);
  const tournamentParticipationRepository =
    new TournamentParticipationRepository(prisma);
  const profileRepository = new ProfileRepository(prisma);
  const tokenRepository = new TokenRepository(prisma);

  const callingPowerCalculator = new NewCallingPowerCalculator();

  const callingPowerService = new CallingPowerService(
    callerRepository,
    callRepository,
    callingPowerCalculator
  );
  const tournamentResultProcessor = new TournamentResultProcessor(
    callerRepository,
    tournamentRepository,
    tournamentParticipationRepository,
    prisma
  );
  const tokenUpdaterService = new TokenUpdaterService(
    pumpfunProvider,
    dexScreenerProvider,
    tokenRepository,
    callRepository
  );
  const mcapUpdaterService = new MCapUpdaterService(
    pumpfunProvider,
    geckoTerminalProvider
  );

  return {
    callerRepository,
    callRepository,
    profileRepository,
    tournamentRepository,
    tournamentParticipationRepository,
    tokenRepository,
    callingPowerCalculator,
    callingPowerService,
    tokenUpdaterService,
    mcapUpdaterService,
    tournamentResultProcessor,
    pumpfunProvider,
    geckoTerminalProvider,
    dexScreenerProvider,
    prisma,
    validateEnv,
  };
}