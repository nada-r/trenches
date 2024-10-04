import { input, select } from '@inquirer/prompts';
import { TokenService } from '@src/services/TokenService';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider';
import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { TokenUpdaterService } from '@src/services/TokenUpdaterService';

export async function displayTokenActions(
  tokenService: TokenService,
  geckoTerminalProvider: GeckoTerminalProvider,
  pumpfunProvider: PumpfunProvider,
  dexScreenerProvider: DexScreenerProvider,
  tokenUpdaterService: TokenUpdaterService
) {
  let actions = [
    { name: 'Update missing tokens in database', value: 'updateTokenCache' },
    { name: 'Get token info', value: 'info' },
    { name: 'Get highest FDV', value: 'highestFdv' },
    { name: 'Back to parent menu', value: 'back' },
  ];

  while (true) {
    const action = await select({
      message: 'Select an action:',
      choices: actions,
    });

    switch (action) {
      case 'updateTokenCache':
        await updateTokenCache(tokenService, tokenUpdaterService);
        break;
      case 'info':
        await tokenInfo(
          tokenService,
          geckoTerminalProvider,
          pumpfunProvider,
          dexScreenerProvider
        );
        break;
      case 'highestFdv':
        await highestFdv(pumpfunProvider);
        break;
      case 'back':
        return; // Exit the function to go back to the parent menu
      default:
        console.log('Not yet implemented');
    }
  }
}

export const updateTokenCache = async (
  tokenService: TokenService,
  tokenUpdaterService: TokenUpdaterService
) => {
  const tokens = await tokenService.findMissingTokens();
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

export const tokenInfo = async (
  tokenService: TokenService,
  geckoTerminalProvider: GeckoTerminalProvider,
  pumpfunProvider: PumpfunProvider,
  dexScreenerProvider: DexScreenerProvider
) => {
  const tokenAddress = await input({
    message: 'Enter token address:',
    required: true,
  });

  const tokenInfo = await pumpfunProvider.getTokenInfo(tokenAddress!);
  let poolAddress = undefined;
  if (tokenInfo) {
    console.log('Address:', tokenInfo.address);
    console.log('Poll:', tokenInfo.poolAddress);
    poolAddress = tokenInfo.poolAddress;

    console.log('Current FDV:', tokenInfo.fdv);

    const highestMCap = await pumpfunProvider.getTokenMCap(tokenAddress);
    console.log('Highest FDV (pump):', highestMCap);
  }

  if (poolAddress) {
    const highestMCap = await geckoTerminalProvider.getTokenMCap(poolAddress);
    console.log('Highest FDV (gecko):', highestMCap);
  }
};

export const highestFdv = async (pumpfunProvider: PumpfunProvider) => {
  const tokenAddress = await input({
    message: 'Enter token address:',
    required: true,
  });

  // const highestFDV = await fdvUpdaterService.getHighestMcap(tokenAddress);
  // console.log('Highest FDV:', highestFDV);
  //
  // const tokenInfo = await pumpfunProvider.getTokenInfo(tokenAddress);
  // if (tokenInfo?.poolAddress) {
  //   console.log('Find pool address:', tokenInfo.poolAddress);
  //   const highestPoolFDV = await fdvUpdaterService.getHighestMcap(
  //     tokenInfo.poolAddress
  //   );
  //   console.log('Highest FDV (pool):', highestPoolFDV);
  // }
};