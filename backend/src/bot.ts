import TelegramBot from 'node-telegram-bot-api';
import AWS from 'aws-sdk';
import bootstrap from './bootstrap';
import { TelegramProvider } from '@src/services/TelegramProvider';
import { str } from 'envalid';
import dayjs from 'dayjs';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;

async function startBot() {
  const {
    callerRepository,
    callRepository,
    callingPowerService,
    tokenRepository,
    mcapUpdaterService,
    tournamentRepository,
    tournamentResultProcessor,
    tokenUpdaterService,
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

  bot.onText(/\/login/, async (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    if (!user) return;

    const telegramId = user.id.toString();
    const username = user.username;

    if (!username) {
      bot.sendMessage(
        chatId,
        'Sorry, you need to set a username in Telegram to use this bot.'
      );
      return;
    }

    try {
      await bot.sendMessage(chatId, `Login to Trenches.top`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Login',
                login_url: { url: 'https://www.trenches.top' },
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      bot.sendMessage(
        chatId,
        'An error occurred during login. Please try again later.'
      );
    }
  });

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
    const caller = await callerRepository.getOrCreateCaller(
      telegramId,
      username,
      imageUrl
    );

    // loop on each token identified in the message
    for (let i = 0; i < splTokens.length; i++) {
      let tokenAddress = splTokens[i];

      // find token information on pump or dexscreener (name, ticker, image, ...)
      let tokenInfo =
        await tokenUpdaterService.findAndUpdateTokenInfo(tokenAddress);
      if (!tokenInfo) {
        // token not found, skip it
        continue;
      }

      // record the call if there is not already one for this token and caller
      const existingCall = await callRepository.getCallByTelegramIdAndToken(
        telegramId,
        tokenInfo.address
      );

      if (!existingCall) {
        await callRepository.createCall({
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

    // get all active calls from the database
    const activeCalls = await callRepository.getActiveCalls();

    // extract unique tokens from the active calls
    const tokensToUpdate = [
      ...new Set(
        activeCalls.map((call) => ({
          tokenAddress: call.tokenAddress,
          poolAddress: call.data?.poolAddress,
        }))
      ),
    ];
    console.log(`Found ${tokensToUpdate.length} unique tokens to process`);

    // check if the pump token is out of bounding curve
    let newPoolsDetected = 0;
    for (const token of tokensToUpdate) {
      if (!token.poolAddress) {
        // if pool address is not available, try to find it
        const poolAddress = await tokenUpdaterService.findAndUpdateTokenPool(
          token.tokenAddress
        );

        // if pool address is found, storing it in the current token object for the next steps
        if (poolAddress) {
          token.poolAddress = poolAddress;
          newPoolsDetected++;
        }
      }
    }
    console.log(
      `${newPoolsDetected} new pools detected (${Date.now() - startTime}ms)`
    );

    const stepTime = Date.now();
    const updatedTokens = [];
    //for each call, get marketcap
    for (const token of tokensToUpdate) {
      try {
        let mcapHistory = await mcapUpdaterService.getMcapHistory(token);

        // token not found (ex, $wSOL address or random)
        if (!mcapHistory) {
          console.log(`Could not get FDV for token ${token.tokenAddress}`);
          // skip this token
          continue;
        }

        // check which call should be updated for this token, get a table of calls to update (often 1 or 2 calls)
        const callToUpdate = activeCalls.filter(
          (call) =>
            call.tokenAddress === token.tokenAddress ||
            call.tokenAddress === token.poolAddress
        );

        let result = 0;
        // update all cals
        for (const call of callToUpdate) {
          let highestMcap = mcapUpdaterService.getHighestMcap(
            mcapHistory,
            call.createdAt
          );
          // if highest detected is indeed higher thatn the on in DB, update the highest value
          if (call.highestFDV < highestMcap) {
            await callRepository.updateCallHighestMcap(call.id, highestMcap);
            result++;
          }
        }

        // then update mcap in token table
        await tokenRepository.updateMcap(
          token.tokenAddress,
          mcapHistory[mcapHistory.length - 1].close
        );

        // if at least one call was updated, add the token address and the pool address to the updatedTokens array
        if (result > 0) {
          updatedTokens.push(token.tokenAddress);
          if (token.poolAddress) {
            updatedTokens.push(token.poolAddress);
          }
        }
      } catch (err) {
        console.error(
          `Error while updating FDV for token ${token.tokenAddress}: ${err.message}`
        );
      }
    }
    console.log(
      ` => Updated FDV for ${updatedTokens.length} tokens (${Date.now() - stepTime}ms)`
    );

    // finally update the calling power for all callers where 1 or more tokens were updated
    if (updatedTokens.length > 0) {
      await callingPowerService.updateCallingPowerFor(updatedTokens);
      await callerRepository.updateCallerRanks();
      console.log(`Updated calling power and ranking`);
    }

    const totalTime = Date.now() - startTime;
    console.log(`Total FDV update process took ${totalTime}ms`);
  };

  // Update Mcap immediately after bot start
  await updateFDV();

  // Then set interval to run every 10 minutes
  setInterval(updateFDV, 10 * 60 * 1000);

  setInterval(async () => {
    const startedTournaments = await tournamentRepository.getAll(['STARTED']);
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
