import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/common/EnvVars';
import server from './server';
import bootstrap from '@src/bootstrap';
import { CallerRepository } from '@src/services/CallerRepository';
import { CallRepository } from '@src/services/CallRepository';
import { CallingPowerService } from '@src/services/CallingPowerService';
import { TournamentRepository } from '@src/services/TournamentRepository';
import { ProfileRepository } from '@src/services/ProfileRepository';

interface IServices {
  caller: CallerRepository;
  call: CallRepository;
  callingPower: CallingPowerService;
  tournament: TournamentRepository;
  profile: ProfileRepository;
}

export const services: Partial<IServices> = {};

/**
 * Adds a new service to the services object if it matches the interface.
 * @param name - The name of the service. This is used to index the service in the services object.
 * @param newService - The constructor function for the service.
 * @param dependencies - The dependencies for the service.
 *
 * @example
 * // Adding a TaskScheduler service
 * addService('scheduler', TaskScheduler);
 *
 * // Adding a chatService with a PrismaClient dependency
 * const prisma = new PrismaClient();
 * addService('chat', chatService, prisma);
 *
 * // Using the added services
 * services.scheduler?.addTask({ running: false, callback: () => console.log("Task executed") });
 * services.chat?.getMessages(1).then(messages => console.log(messages));
 */
export function addService<T extends keyof IServices>(
  name: T,
  newService: new (...args: any[]) => IServices[T],
  ...dependencies: any[]
): void {
  if (dependencies.length) services[name] = new newService(...dependencies);
  else services[name] = new newService();
}

export function addExistingService<T extends keyof IServices>(
  name: T,
  service: IServices[T]
): void {
  services[name] = service;
}

// **** Run **** //

const SERVER_START_MSG =
  'Express server started on port: ' + EnvVars.Port.toString();

// example how use service
// server.get('card/create', async() => {
//   await services.card?.createCard()
// });

server.listen(EnvVars.Port, async () => {
  const {
    callerRepository,
    callRepository,
    callingPowerService,
    profileRepository,
    tournamentRepository,
  } = await bootstrap();
  addExistingService('caller', callerRepository);
  addExistingService('call', callRepository);
  addExistingService('callingPower', callingPowerService);
  addExistingService('tournament', tournamentRepository);
  addExistingService('profile', profileRepository);

  logger.info(SERVER_START_MSG);
});
