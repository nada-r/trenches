import './pre-start'; // Must be the first import
import logger from 'jet-logger';

import EnvVars from '@src/common/EnvVars';
import server from './server';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import bootStrap from './bootstrap';

import {
  CardService,
  PowerService,
  UserService,
} from './services';
import bootstrap from '@src/bootstrap';

interface IServices {
  user: UserService,
  card: CardService,
  power: PowerService
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
// **** Run **** //

const SERVER_START_MSG =
  'Express server started on port: ' + EnvVars.Port.toString();

// example how use service
// server.get('card/create', async() => {
//   await services.card?.createCard()
// });

server.listen(EnvVars.Port, async () => {
  const { prisma } = await bootstrap();
  addService('user', UserService, prisma);
  addService('card', CardService, prisma);
  addService('power', PowerService, prisma);
  
  logger.info(SERVER_START_MSG)}
)
