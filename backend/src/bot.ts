import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import bootstrap from './bootstrap';
import { env } from 'process';

interface TokenInfo {
  address: string;
  fdv: number;
  symbol: string;
  chain: string;
}

async function startBot() {
  const { callerService, callService, prisma } = await bootstrap();

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

  const BOT_TOKEN = env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is not set');
    process.exit(1);
  }
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
      const caller = await callerService.getOrCreateCaller(
        telegramId,
        username
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

    for (const token of uniqueTokens) {
      const tokenInfo = await getSolanaToken(token);
      if (tokenInfo) {
        const newFDV = tokenInfo.fdv;
        const result = await callService.updateHighestFdvByToken(token, newFDV);
        console.log(`Updated ${result.count} objects for token ${token}`);
      }
    }
  }, 60000);
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
      console.error('Error fetching token pair data:', error);
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
      console.error('Error fetching token pair data:', error);
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
    });
}

startBot().catch(console.error);