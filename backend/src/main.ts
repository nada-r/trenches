import bootstrap from '@src/bootstrap';

async function main() {
  const { cardService, powerService } = await bootstrap();
  {
    /*await userService.createUser({name: "dumbledior", walletString: "DeAW7SyArr7Stk2U6NL8EtoXaLNPyG3wfkVfRzvcPG4S"})*/
  }
  console.log(
    await powerService.createPower({ name: 'luigiscalls', value: 736 })
  );
  await cardService.createCard(
    {
      name: 'luigiscalls',
      price: 7,
      image: 'https://trenches.fra1.cdn.digitaloceanspaces.com/Luigicall.jpg',
    },
    5
  );
}

main().catch((e) => console.error('!Unhandled error in main:', e));