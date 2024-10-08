import { TournamentParticipation } from '@prisma/client';

export function createCaller(
  id: number,
  telegramId: string,
  name: string,
  data: any = {}
) {
  return {
    id,
    telegramId,
    name,
    image: null,
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createParticipation(
  id: number,
  walletPubkey: string,
  tournamentId: number,
  callers: string[] = [],
  data: any = {}
): TournamentParticipation {
  return {
    id,
    walletPubkey,
    tournamentId,
    callers,
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
