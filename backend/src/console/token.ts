import { input, select } from '@inquirer/prompts';
import { TokenRepository } from '@src/services/TokenRepository';
import { GeckoTerminalProvider } from '@src/services/GeckoTerminalProvider';
import { DexScreenerProvider } from '@src/services/DexScreenerProvider';
import { PumpfunProvider } from '@src/services/PumpfunProvider';
import { TokenUpdaterService } from '@src/services/TokenUpdaterService';
import { EnvType } from '@src/console';

type TokenActionsDependencies = {
  tokenRepository: TokenRepository;
  tokenUpdaterService: TokenUpdaterService;
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
    { name: 'Get highest FDV', value: 'highestFdv' },
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
      case 'highestFdv':
        await highestFdv(dependencies);
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
  const { geckoTerminalProvider, pumpfunProvider } = dependencies;

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

const highestFdv = async (dependencies: TokenActionsDependencies) => {
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
