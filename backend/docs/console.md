# The Console

Command-line interface (CLI) for interacting with the local or production backend.

## Execution

The console doesn't need the backend to function. Simply run the following command:

```shell
npm run console
```

Like the backend, the console uses the .env.vault file for environment variables. Your DOTENV_KEY will designate the environment that will be loaded.

> [!IMPORTANT] 
> A message will warn you if you're using the production environment. Be careful!

> [!TIP]
> If the database URL stays localhost, comment out DATABASE_URL from the .env file.

> [!WARNING]
> npx prisma ... requires DATABASE_URL in the .env file. You'll need to juggle this.

## Tournament

### "Create a new tournament."

Information required:
- Tournament name
- The start date and time that define the moment when the tournament participations are open. Formatted as YYYY-MM-DD HH:mm in UTC (e.g., 2023-09-20 14:30)
- The opening participation duration (in days)
- The waiting before finish duration (in days)
- The Prize amount (in SOL)
- The Supply burn percentage

The command performs the following validations:
- Ensures the start date is valid and not in the past

> After entering all the required information, the tournament will be created in the database.

#### Tournament detailed information

- Until the tournament start date is reached, the tournament appears in the upcoming list
- From the tournament start date, the participations are freely open for the opening duration
- Once the opening duration is over, players wait for the tournament to finish
- Once the waiting duration is over, the tournament is finished, calling power saved in DB and the winner is selected

## Caller

### "Explain Calling Power"

Displays the calling power calculation details for your callers. Before launching, update the calling power methods used in the caller.ts file.

#### If caller_id is provided
> it shows detailed calculation information for that specific caller.

#### Else
> it displays a table of all callers with their respective calling power values.

### "Update Calling Power"

Update the calling power for your callers in database. The calculation method used is the same as production, defined as `engineConfig` in the `CallingPowerService.ts` file.

> [!WARNING]
> Do not update `engineConfig` for test purposes, please use `Explain Calling Power` command instead, it's safer. Update engineConfig only if you plan to push it!

#### If caller_id is provided
> it only updates the power for that specific caller. For example if you correct a call mcap value.

#### Else
> it updates the calling power for all callers. Only use it if you change `engineConfig` and it needs to recalculate all calling powers.

## Token

### "Get Token Info"

Get detailed information about a token like the backend does.

### "Update tokens in database"

This simple command updates tokens table in database: find missing, update image, name, pollAddress, and what you want.
