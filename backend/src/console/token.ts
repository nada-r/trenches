import { select } from '@inquirer/prompts';
import { TokenService } from '@src/services/TokenService';

export async function displayCallerActions(tokenService: TokenService) {
  let actions = [{ name: 'Update token cache', value: 'updateTokenCache' }];

  const action = await select({
    message: 'Select an action:',
    choices: actions,
  });

  switch (action) {
    case 'updateTokenCache':
      await updateTokenCache(tokenService);
      break;
    default:
      console.log('Not yet implemented');
  }
}

export const updateTokenCache = async (tokenService: TokenService) => {
  const tokens = await tokenService.findMissingTokens();
  let count = 0;
  let notfounds = 0;
  for (const token of tokens) {
    console.log(token);
    const tokenInfo = null; //await tokenInfoProvider.getSolanaToken(token);
    if (tokenInfo) {
      await tokenService.createToken(tokenInfo);
      count++;
    } else {
      notfounds++;
    }
  }

  console.log(`Updated ${count} tokens. ${notfounds} tokens not found.`);
};
