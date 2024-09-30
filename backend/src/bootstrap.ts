import { cleanEnv, str } from 'envalid';
import { PrismaClient } from '@prisma/client';
import {
  CallerService,
  CallingPowerService,
  CallService,
  ProfileService,
  TournamentService,
} from './services';
import 'dotenv/config';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { TokenService } from '@src/services/TokenService';
import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider'; // ES 2015
import axios from 'axios';
import axiosRetry, { retryAfter } from 'axios-retry';
import { TournamentResultProcessor } from '@src/process/TournamentResultProcessor';
import { FdvUpdaterService } from '@src/services/FdvUpdaterService';

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

  const callerService = new CallerService(prisma);
  const callService = new CallService(prisma);
  const callingPowerService = new CallingPowerService(
    callerService,
    callService
  );
  const tournamentService = new TournamentService(prisma);
  const tournamentResultProcessor: TournamentResultProcessor =
    new TournamentResultProcessor(callerService, tournamentService, prisma);
  const profileService = new ProfileService(prisma);
  const tokenService = new TokenService(prisma);
  const geckoTerminalProvider = new GeckoTerminalProvider();
  const dexScreenerProvider = new DexScreenerProvider();
  const pumpfunProvider = new PumpfunProvider(geckoTerminalProvider);
  const fdvUpdaterService: FdvUpdaterService = new FdvUpdaterService(
    geckoTerminalProvider,
    pumpfunProvider
  );

  return {
    callerService,
    callService,
    callingPowerService,
    profileService,
    tournamentService,
    tournamentResultProcessor,
    tokenService,
    pumpfunProvider,
    geckoTerminalProvider,
    dexScreenerProvider,
    fdvUpdaterService,
    prisma,
    validateEnv,
  };
}