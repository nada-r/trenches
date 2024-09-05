import z from 'zod';
import { config } from 'dotenv-vault';
import findConfig from 'find-config';

// Make sure all the Envs are loaded when launching the server
// add the new env under envVariables
const envVariables = z.object({
  DATABASE_URL: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> { }
  }
}

function error(...args: any) {
  console.error(args);
  return 1; // Stop the server from starting
}

async function bootStrap() {
  try { 
    const path = findConfig('.env.vault');
    if (!path)
      return error("Failed to locate .env.vault");

    const dotenvResult = config({
      DOTENV_KEY: process.env.DOTENV_KEY,
      path: path!
    });

    if (dotenvResult.error)
      return error("dotenv.config failed", error);

    if (Object.keys(dotenvResult.parsed!).length === 0)
      return error("No environment variables found in the parsed dotenv result");

    envVariables.parse(dotenvResult.parsed);

    // if (!process.env.CORS)
    //   return error("CORS variable is missing from env");
    console.log(dotenvResult.parsed);

  } catch (e) {
    console.error(e);
    return 1;
  }
  return 0;
}

export default bootStrap;