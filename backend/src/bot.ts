import TelegramBot from 'node-telegram-bot-api';
import AWS from 'aws-sdk';
import bootstrap from './bootstrap';
import dotenv from 'dotenv';
import { TelegramProvider } from '@src/services/TelegramProvider';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
dotenv.config();

async function startBot() {
  const {
    callerService,
    callService,
    callingPowerService,
    tokenService,
    tokenInfoProvider,
    pumpfunProvider,
    geckoTerminalProvider,
    dexScreenerProvider,
    prisma,
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

  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is not set');
    process.exit(1);
  }

  if (
    !process.env.CDN_ENDPOINT ||
    !process.env.CDN_KEY ||
    !process.env.CDN_SECRET ||
    !process.env.CDN_SPACE_NAME
  ) {
    console.error('CDN environment variables are not set');
    process.exit(1);
  }

  const s3 = new AWS.S3({
    endpoint: process.env.CDN_ENDPOINT,
    accessKeyId: process.env.CDN_KEY,
    secretAccessKey: process.env.CDN_SECRET,
  });

  const bot = new TelegramBot(BOT_TOKEN, { polling: true });

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

  setInterval(
    async () => {
      const activeCalls = await callService.getActiveCalls();
      const uniqueTokens = [
        ...new Set(
          activeCalls.map((call) => call.data?.poolAddress || call.tokenAddress)
        ),
      ];

      const poolToToken = new Map<string, string>();
      for (const token of uniqueTokens) {
        const tokenInfo = await pumpfunProvider.getTokenInfo(token);
        if (tokenInfo && tokenInfo.poolAddress) {
          // Store token info in the database
          await tokenService.createToken(tokenInfo);
          poolToToken.set(tokenInfo.poolAddress, token);
        }
      }

      const tokensToUpdate = [
        ...new Set([...uniqueTokens, ...poolToToken.keys()]),
      ];

      const updatedTokens = [];
      for (const token of tokensToUpdate) {
        let newFDV = await geckoTerminalProvider.getHighestMCap(token);
        if (!newFDV) {
          newFDV = await pumpfunProvider.getHighestMCap(token);
          if (!newFDV) {
            continue;
          }
        }
        let result = (await callService.updateHighestFdvByToken(token, newFDV))
          .count;
        const pumpToken = poolToToken.get(token);
        if (pumpToken) {
          result += (
            await callService.updateHighestFdvByToken(pumpToken, newFDV)
          ).count;
        }
        if (result > 0) {
          updatedTokens.push(token);
        }
      }

      console.log(` => Updated FDV for ${updatedTokens.length} tokens`);
      if (updatedTokens.length > 0) {
        await callingPowerService.updateCallingPowerFor(updatedTokens);
      }
    },
    1 * 30 * 1000
  );
}

startBot().catch(console.error);
