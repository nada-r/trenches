import TelegramBot from 'node-telegram-bot-api';
import AWS from 'aws-sdk';
import axios from 'axios';
import bootstrap from './bootstrap';
import dotenv from 'dotenv';

require('aws-sdk/lib/maintenance_mode_message').suppress = true;
dotenv.config();

interface TokenInfo {
  address: string;
  fdv: number;
  symbol: string;
  chain: string;
}

async function startBot() {
  const { callerService, callService, callingPowerService, prisma } =
    await bootstrap();

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

    let splTokens = message.match(/[1-9A-HJ-NP-Za-z]{32,44}/g);

    if (splTokens) {
      const imageUrl = await handleUserProfileImage(
        bot,
        user.id,
        s3,
        BOT_TOKEN
      );
      const caller = await callerService.getOrCreateCaller(
        telegramId,
        username,
        imageUrl
      );

      for (let i = 0; i < splTokens.length; i++) {
        let token = splTokens[i];
        let tokenInfo = await getSolanaToken(token);
        if (tokenInfo != null) {
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
              data: null,
            });
            console.log(
              `Created call for token ${token} and caller ${caller.name}`
            );
          } else {
            console.log(
              `Call already exists for token ${token} and caller ${caller.name}`
            );
          }
        }
      }
    }
  });

  setInterval(async () => {
    const activeCalls = await callService.getActiveCalls();
    const uniqueTokens = [
      ...new Set(activeCalls.map((call) => call.tokenAddress)),
    ];
    console.log(
      `Total of ${activeCalls.length} active calls to update, ${uniqueTokens.length} unique tokens`
    );

    const updatedTokens = [];

    for (const token of uniqueTokens) {
      const tokenInfo = await getSolanaToken(token);
      if (tokenInfo) {
        const newFDV = tokenInfo.fdv;
        const result = await callService.updateHighestFdvByToken(token, newFDV);
        if (result.count > 0) {
          updatedTokens.push(token);
        }
      }
    }

    console.log(` => Updated FDV for ${updatedTokens.length} tokens`);
    if (updatedTokens.length > 0) {
      await callingPowerService.updateCallingPower(updatedTokens);
    }
  }, 60000);
}

async function handleUserProfileImage(
  bot: TelegramBot,
  userId: number,
  s3: AWS.S3,
  botToken: string
): Promise<string | undefined> {
  const s3Key = `profile_pictures/${userId}.jpg`;

  try {
    try {
      await s3
        .headObject({
          Bucket: process.env.CDN_SPACE_NAME as string,
          Key: s3Key,
        })
        .promise();

      // console.log(`Profile picture already exists: ${s3Key}`);
      return `https://${process.env.CDN_SPACE_NAME}.${process.env.CDN_ENDPOINT}/profile_pictures/${userId}.jpg`;
    } catch (err) {
      if (err.code !== 'NotFound') {
        throw err; // Handle other errors
      }
      console.log('Image does not exist, proceeding with upload...');
    }

    const photos = await bot.getUserProfilePhotos(userId);
    if (photos.total_count > 0) {
      const fileId = photos.photos[0][0].file_id;
      const file = await bot.getFile(fileId);

      const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
      });

      const params = {
        Bucket: process.env.CDN_SPACE_NAME as string,
        Key: s3Key,
        Body: response.data,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
      };

      const uploadResult = await s3.putObject(params).promise();
      console.log(
        `Successfully uploaded image to DigitalOcean Space: ${uploadResult}`
      );

      return `https://${process.env.CDN_SPACE_NAME}.${process.env.CDN_ENDPOINT}/profile_pictures/${userId}.jpg`;
    }
  } catch (error) {
    console.error('Error fetching or uploading profile photo:', error);
    return undefined;
  }

  return undefined;
}

async function getSolanaToken(token: string): Promise<TokenInfo | null> {
  return axios
    .get(`https://api.dexscreener.com/latest/dex/tokens/${token}`)
    .then((response) => {
      if (
        response.data.pairs != null &&
        response.data.pairs.length > 0 &&
        response.data.pairs[0].chainId == 'solana'
      ) {
        let ca = response.data.pairs[0].baseToken.address;
        let symbol = response.data.pairs[0].baseToken.symbol;
        let fdv = response.data.pairs[0].fdv;
        // let price = response.data.pairs[0].priceUsd;
        // fdv = formatNumber(fdv);
        let tokenInfo: TokenInfo = {
          address: ca,
          fdv: parseFloat(fdv),
          symbol: symbol,
          chain: 'solana',
        };
        return tokenInfo;
      } else {
        // console.log("Token not found in dexscreener, checking pools");
        return getSolanaPool(token);
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token data:', error);
      }
      return null;
    });
}

async function getSolanaPool(address: string): Promise<TokenInfo | null> {
  return axios
    .get(`https://api.dexscreener.com/latest/dex/pairs/solana/${address}`)
    .then((response) => {
      if (response.data.pairs != null && response.data.pairs.length > 0) {
        let ca = response.data.pairs[0].baseToken.address;
        let symbol = response.data.pairs[0].baseToken.symbol;
        let fdv = response.data.pairs[0].fdv;
        // let price = response.data.pairs[0].priceUsd;
        // fdv = formatNumber(fdv);
        let tokenInfo: TokenInfo = {
          address: ca,
          fdv: parseFloat(fdv),
          symbol: symbol,
          chain: 'solana',
        };
        return tokenInfo;
      } else {
        // console.log("Token not found in dexscreener pools");
        return getPumpfunToken(address);
        // return null;
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token', error);
      }
      return null;
    });
}

async function getPumpfunToken(token: string): Promise<TokenInfo | null> {
  return axios
    .get(`https://frontend-api.pump.fun/coins/${token}`)
    .then((response) => {
      if (response.data != null && response.data.mint) {
        let ca = response.data.mint;
        let symbol = response.data.symbol;
        let fdv = response.data.usd_market_cap;
        // fdv = formatNumber(fdv);
        let tokenInfo: TokenInfo = {
          address: ca,
          fdv: parseFloat(fdv),
          symbol: symbol,
          chain: 'solana',
        };
        return tokenInfo;
      } else {
        // console.log("Token not found in pumpfun");
        return null;
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 429) {
        console.log(`429 on ${error.config.url}`);
      } else {
        console.error('Error fetching token', error);
      }
      return null;
    });
}

startBot().catch(console.error);
