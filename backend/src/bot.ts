import TelegramBot from 'node-telegram-bot-api';
import AWS from 'aws-sdk';
import bootstrap from './bootstrap';
import { TelegramProvider } from '@src/services/TelegramProvider';
import { str } from 'envalid';
import dayjs from 'dayjs';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;

async function startBot() {
  const {
    callerService,
    callService,
    callingPowerService,
    tokenService,
    pumpfunProvider,
    geckoTerminalProvider,
    dexScreenerProvider,
    tournamentService,
    tournamentResultProcessor,
    prisma,
    validateEnv,
  } = await bootstrap();
  const telegramProvider = new TelegramProvider();

  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    console.log('Disconnected from database');
    process.exit(0);
  });

  validateEnv({
    BOT_TOKEN: str(),
    CDN_ENDPOINT: str(),
    CDN_KEY: str(),
    CDN_SECRET: str(),
    CDN_SPACE_NAME: str(),
  });

  const s3 = new AWS.S3({
    endpoint: process.env.CDN_ENDPOINT,
    accessKeyId: process.env.CDN_KEY,
    secretAccessKey: process.env.CDN_SECRET,
  });

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const bot = new TelegramBot(BOT_TOKEN!, { polling: true });

  bot.on('polling_error', (error) => console.log(error));

  bot.on('message', async (msg) => {
    const user = msg.from;
    if (!user) return;
    if (user.is_bot) return;
    const telegramId = user.id.toString();
    const username = user.username;
    if (!username) {
      console.log('No username found for user', user);
      return;
    }
    const message = msg.text;
    if (!message) return;
    handleMessage(telegramId, username, message, user.id, true);
  });

  bot.on('channel_post', async (msg) => {
    const chat = msg.chat;
    if (!chat) return;
    const telegramId = chat.id.toString();
    const username = chat.title;
    if (!username) {
      console.log('No username found for chat', chat);
      return;
    }
    const message = msg.text;
    if (!message) return;
    handleMessage(telegramId, username, message, chat.id, false);
  });

  // doc
  async function handleMessage(
    telegramId: string,
    username: string,
    message: string,
    userId: number,
    isNormalUser: boolean
  ) {
    let splTokens = message.match(/[1-9A-HJ-NP-Za-z]{32,44}/g);
    if (!splTokens) {
      return;
    }

    const imageUrl = await telegramProvider.handleUserProfileImage(
      bot,
      userId,
      s3,
      BOT_TOKEN as string,
      isNormalUser
    );
    const caller = await callerService.getOrCreateCaller(
      telegramId,
      username,
      imageUrl
    );

    for (let i = 0; i < splTokens.length; i++) {
      let tokenAddress = splTokens[i];

      // Check if the token exists in the Pumpfun
      let tokenInfo = await pumpfunProvider.getTokenInfo(tokenAddress);
      if (!tokenInfo) {
        tokenInfo = await dexScreenerProvider.getTokenInfo(tokenAddress);
        if (!tokenInfo) {
          tokenInfo = await dexScreenerProvider.getPoolInfo(tokenAddress);
          if (!tokenInfo) {
            continue;
          }
        }
      }

      // Store token info in the database
      await tokenService.createToken(tokenInfo);

      // record the call if there is not already one for this token and caller
      const existingCall = await callService.getCallByTelegramIdAndToken(
        telegramId,
        tokenInfo.address
      );

      if (!existingCall) {
        await callService.createCall({
          tokenAddress: tokenInfo.address,
          startFDV: tokenInfo.fdv,
          highestFDV: tokenInfo.fdv,
          callerId: caller.id,
          data: {
            poolAddress: tokenInfo.poolAddress,
          },
        });
        console.log(
          `Created call for token ${tokenAddress} and caller ${caller.name}`
        );
      } else {
        console.log(
          `Call already exists for token ${tokenAddress} and caller ${caller.name}`
        );
      }
    }
  }

  const updateFDV = async () => {
    const startTime = Date.now();
    console.log('Starting FDV update process...');

    const activeCalls = await callService.getActiveCalls();
    const tokensToUpdate = [
      ...new Set(
        activeCalls.map((call) => ({
          tokenAddress: call.tokenAddress,
          poolAddress: call.data?.poolAddress,
        }))
      ),
    ];
    let stepTime = Date.now();
    console.log(
      `Found ${tokensToUpdate.length} unique tokens to process (${stepTime - startTime}ms)`
    );

    let newPoolsDetected = 0;
    for (const token of tokensToUpdate) {
      if (token.poolAddress) {
        continue;
      }

      const tokenInfo = await pumpfunProvider.getTokenInfo(token.tokenAddress);
      if (tokenInfo && tokenInfo.poolAddress) {
        await tokenService.createToken(tokenInfo);

        // update current state
        token.poolAddress = tokenInfo.poolAddress;
        newPoolsDetected++;
      }

      //TODO update calls too
    }
    console.log(
      `${newPoolsDetected} new pools detected (${Date.now() - stepTime}ms)`
    );
    stepTime = Date.now();

    const updatedTokens = [];
    for (const token of tokensToUpdate) {
      let newFDV = undefined;
      if (token.poolAddress) {
        newFDV = await geckoTerminalProvider.getHighestMCap(token.poolAddress);
      }
      if (!newFDV && !token.tokenAddress.endsWith('pump')) {
        newFDV = await geckoTerminalProvider.getHighestMCap(token.tokenAddress);
      }
      if (!newFDV) {
        newFDV = await pumpfunProvider.getHighestMCap(token.tokenAddress);
      }
      if (!newFDV) {
        console.log(`Could not get FDV for token ${token.tokenAddress}`);
        continue;
      }

      let result = (
        await callService.updateHighestFdvByToken(token.tokenAddress, newFDV)
      ).count;
      if (token.poolAddress) {
        result += (
          await callService.updateHighestFdvByToken(token.poolAddress, newFDV)
        ).count;
      }
      if (result > 0) {
        updatedTokens.push(token.tokenAddress);
        if (token.poolAddress) {
          updatedTokens.push(token.poolAddress);
        }
      }
    }
    console.log(
      ` => Updated FDV for ${updatedTokens.length} tokens (${Date.now() - stepTime}ms)`
    );

    if (updatedTokens.length > 0) {
      const callingPowerStartTime = Date.now();
      await callingPowerService.updateCallingPowerFor(updatedTokens);
      console.log(
        `Updated calling power in ${Date.now() - callingPowerStartTime}ms`
      );
    }

    const totalTime = Date.now() - startTime;
    console.log(`Total FDV update process took ${totalTime}ms`);
  };

  // Run immediately
  await updateFDV();

  // Then set interval to run every 30 minutes
  setInterval(updateFDV, 30 * 60 * 1000);

  setInterval(async () => {
    const startedTournaments = await tournamentService.getStarted();
    for (const tournament of startedTournaments) {
      const startedAt = dayjs(tournament.startedAt);
      const endTime = startedAt.add(tournament.metadata.endDuration, 'second');
      const now = dayjs();
      if (now.isAfter(endTime)) {
        console.log(
          `Complete tournament: ${tournament.name} [${tournament.id}]`
        );
        await tournamentResultProcessor.processResults(tournament.id);
      }
    }
  }, 60 * 1000);
}

startBot().catch(console.error);
