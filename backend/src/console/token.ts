import { input, select } from '@inquirer/prompts';
import { TokenRepository } from '@src/services/TokenRepository';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider';
import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { TokenUpdaterService } from '@src/services/TokenUpdaterService';
import { EnvType } from '@src/console';
import { MCapUpdaterService } from '@src/services/MCapUpdaterService';
import dayjs from 'dayjs';

type TokenActionsDependencies = {
  tokenRepository: TokenRepository;
  tokenUpdaterService: TokenUpdaterService;
  mcapUpdaterService: MCapUpdaterService;
  geckoTerminalProvider: GeckoTerminalProvider;
  pumpfunProvider: PumpfunProvider;
  dexScreenerProvider: DexScreenerProvider;
};

export async function displayTokenActions(
  env: EnvType,
  dependencies: TokenActionsDependencies
) {
  let actions = [
    { name: 'Update missing tokens in database', value: 'updateTokenCache' },
    { name: 'Get token info', value: 'info' },
    { name: '< Back', value: 'back' },
  ];

  while (true) {
    const action = await select({
      message: 'Select an action:',
      choices: actions,
    });

    switch (action) {
      case 'updateTokenCache':
        await updateTokenCache(dependencies);
        break;
      case 'info':
        await tokenInfo(dependencies);
        break;
      case 'back':
        return; // Exit the function to go back to the parent menu
      default:
        console.log('Not yet implemented');
    }
  }
}

const updateTokenCache = async (dependencies: TokenActionsDependencies) => {
  const { tokenRepository, tokenUpdaterService } = dependencies;
  const tokens = await tokenRepository.findMissingTokens();
  let count = 0,
    notfounds = 0;
  for (const token of tokens) {
    console.log('Update token:', token);
    let tokenInfo = await tokenUpdaterService.findAndUpdateTokenInfo(token);
    if (tokenInfo) {
      count++;
    } else {
      notfounds++;
    }
  }

  console.log(`Updated ${count} tokens. ${notfounds} tokens not found.`);
};

const tokenInfo = async (dependencies: TokenActionsDependencies) => {
  const { tokenUpdaterService, mcapUpdaterService } = dependencies;

  const tokenAddress = await input({
    message: 'Enter token address:',
    required: true,
  });

  const tokenInfo = await tokenUpdaterService.findAndUpdateTokenInfo(
    tokenAddress!
  );
  if (tokenInfo) {
    console.log('Address:', tokenInfo.tokenAddress);
    console.log('Poll:', tokenInfo.poolAddress);

    console.log('Current FDV:', tokenInfo.fdv);

    const mcapHistory = await mcapUpdaterService.getMcapHistory(tokenInfo);
    if (mcapHistory) {
      const highestMCap = mcapUpdaterService.getHighestMcap(
        mcapHistory,
        dayjs().subtract(24, 'hours').toDate()
      );
      console.log('Highest FDV (last 24h):', highestMCap);
    }
  }
};
