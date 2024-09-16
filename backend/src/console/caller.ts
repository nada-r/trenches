import { input, number } from '@inquirer/prompts';
import { CardService, PowerService } from '@src/services';

export async function addCaller(
  powerService: PowerService,
  cardService: CardService
) {
  const caller = {
    name: await input({ message: "Caller's name:" }),
    imageUrl: await input({ message: 'Image URL:' }),
    power: (await number({ message: 'Power value:' })) || 0,
  };

  console.log('Create caller:', caller);
  const power = await powerService.createPower({
    name: caller.name,
    value: caller.power,
  });
  await cardService.createCard(
    {
      name: caller.name,
      price: 0,
      image: caller.imageUrl,
    },
    power.id
  );
}
