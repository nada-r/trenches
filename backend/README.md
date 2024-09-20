## About

This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

## Configure environment

```
1. run : npx dotenv-vault@latest keys
2. set DOTENV_KEY envvar with the value of development environment 
3. run : npx dotenv-vault@latest open
4. run : npx dotenv-vault@latest pull

```

## Setup empty Database

```
npx prisma db push
```

## DotEnv

```
# pull last environment state
npx dotenv-vault@latest pull dev/production

# push a new environment state
npx dotenv-vault@latest push dev/production
```

## bot

## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm test`

Run all unit-tests with hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Run a single unit-test.

### `npm run test:no-reloading`

Run all unit-tests without hot-reloading.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.


## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`. 
