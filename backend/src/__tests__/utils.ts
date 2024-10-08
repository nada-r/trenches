import {
  Token,
  Tournament,
  TournamentParticipation,
  TournamentStatus,
} from '@prisma/client';
import { TokenInfo } from '@src/services/TokenRepository';

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

export function createTokenInfo(
  address: string,
  name: string,
  ticker: string,
  fdv: number = 1000000
): TokenInfo {
  return {
    address,
    symbol: ticker,
    name,
    fdv,
    url: 'https://test.com',
    image_uri: 'https://test.com/image.png',
    chain: 'solana',
    type: 'pumpfun',
  };
}

export function createToken(
  id: number,
  address: string,
  name: string,
  ticker: string,
  data: any = {}
): Token {
  return {
    id,
    address,
    name,
    ticker,
    url: '',
    image_uri: '',
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function fromTokenInfo(tokenInfo: TokenInfo, id: number): Token {
  return {
    id, // Assuming id is auto-generated or needs to be set separately
    address: tokenInfo.address,
    name: tokenInfo.name,
    ticker: tokenInfo.symbol,
    url: tokenInfo.url,
    image_uri: tokenInfo.image_uri,
    data: {
      mcap: tokenInfo.fdv,
      poolAddress: tokenInfo.poolAddress,
      type: tokenInfo.type,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createCall(
  id: number,
  tokenAddress: string,
  startFDV: number = 1000,
  highestFDV: number = 1500,
  callerId: number = 1,
  data: any = {}
) {
  return {
    id,
    tokenAddress,
    startFDV,
    highestFDV,
    callerId,
    data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createTournament(
  id: number,
  status: TournamentStatus,
  startedAt: Date = new Date(),
  openDuration: number = 24 * 60 * 60,
  endDuration: number = 2 * 24 * 60 * 60,
  prize: number = 50,
  supplyBurn: number = 5
): Tournament {
  return {
    id,
    name: `Tournament ${id}`,
    status,
    metadata: {
      openDuration,
      endDuration,
      prize,
      supplyBurn,
    },
    startedAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createParticipation(
  id: number,
  walletPubkey: string,
  callers: string[],
  tournamentId: number = 1,
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
