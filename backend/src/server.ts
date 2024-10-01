/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes';

import Paths from '@src/common/Paths';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';
import { NodeEnvs } from '@src/common/misc';
import cors from 'cors';
import { services } from '.';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
app.use(cors());

// app.get("/nom_de_route", async (req: Request, res: Response) => {

// })
app.get('/callers', async (req: Request, res: Response) => {
  const cards = await services.caller?.getAll();
  res.json(cards);
});
app.get('/caller/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const caller = await services.caller?.getCallerWithCall(id);
  res.json(caller);
});
app.post('/caller/:id/follow', async (req: Request, res: Response) => {
  const { walletPubkey } = req.body;
  const id = Number(req.params.id);
  await services.profile?.followCaller(walletPubkey, id);

  res.status(200).json({ message: 'Follow successful' });
});
app.post('/caller/:id/unfollow', async (req: Request, res: Response) => {
  const { walletPubkey } = req.body;
  const id = Number(req.params.id);
  await services.profile?.unfollowCaller(walletPubkey, id);

  res.status(200).json({ message: 'Follow successful' });
});

app.get('/calls/tops', async (req: Request, res: Response) => {
  const topOpenCalls = await services.call?.getOpenCalls();
  const closedCalls = await services.call?.getClosedCalls();
  res.json({
    topOpenCalls,
     closedCalls
  });
});

app.get('/tournament/all', async (req: Request, res: Response) => {
  const tournaments = await services.tournament?.getAvailable();
  res.json(tournaments);
});

app.get('/tournament/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const tournament = await services.tournament?.getById(id);

  if (tournament) {
    res.json(tournament);
  } else {
    res.status(404).json({ message: 'Tournament not found' });
  }
});

app.post('/tournament/join', async (req: Request, res: Response) => {
  const { tournamentId, walletPubkey, callers } = req.body;

  if (
    !tournamentId ||
    !walletPubkey ||
    !Array.isArray(callers) ||
    callers.length !== 3
  ) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const result = await services.tournament?.joinTournament({
      tournamentId,
      walletPubkey,
      callers,
      data: {}
    });
    res.json(result);
  } catch (error) {
    morgan('combined')(req, res, () => {
      console.error(
        `Error participating in tournament: ${(error as Error).message}`
      );
    });
    res
      .status(500)
      .json({
        message: 'Error participating in tournament',
        error: (error as Error).name,
      });
  }
});

app.get(
  '/tournament/:id/:walletPubkey',
  async (req: Request, res: Response) => {
    const tournamentId = Number(req.params.id);
    const walletPubkey = req.params.walletPubkey;

    if (!tournamentId || !walletPubkey) {
      return res.status(400).json({ message: 'Wallet public key is required' });
    }

    try {
      const participation =
        await services.tournament?.getMyTournamentParticipation(
          tournamentId,
          walletPubkey
        );
      if (participation) {
        res.json(participation);
      } else {
        res
          .status(404)
          .json({ message: 'No participations found for this wallet' });
      }
    } catch (error) {
      morgan('combined')(req, res, () => {
        console.error(
          `Error fetching wallet tournament participation: ${(error as Error).message}`
        );
      });
      res
        .status(500)
        .json({
          message: 'Error fetching your tournament participation',
          error: (error as Error).name,
        });
    }
  }
);

app.post('/profile/my', async (req: Request, res: Response) => {
  const { walletPubkey } = req.body;

  if (!walletPubkey) {
    return res.status(400).json({ message: 'Wallet public key is required' });
  }

  try {
    const profile = await services.profile?.getProfile(walletPubkey);
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ message: 'Profile not found for this wallet' });
    }
  } catch (error) {
    morgan('combined')(req, res, () => {
      console.error(`Error fetching profile: ${(error as Error).message}`);
    });
    res
      .status(500)
      .json({
        message: 'Error fetching profile',
        error: (error as Error).name,
      });
  }
});

app.get('/portfolio/:walletPubkey', async (req: Request, res: Response) => {
  const walletPubkey = req.params.walletPubkey;

  if (!walletPubkey) {
    return res.status(400).json({ message: 'Wallet public key is required' });
  }

  try {
    const portfolio = await services.profile?.claim(walletPubkey);
    if (portfolio) {
      res.json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio not found for this wallet' });
    }
  } catch (error) {
    morgan('combined')(req, res, () => {
      console.error(`Error fetching portfolio: ${(error as Error).message}`);
    });
    res
      .status(500)
      .json({
        message: 'Error fetching portfolio',
        error: (error as Error).name,
      });
  }
});

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

// **** Export default **** //

export default app;
