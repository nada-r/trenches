import { input } from '@inquirer/prompts';
import { CallerService } from '@src/services/CallerService';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function addCaller(callerService: CallerService) {
  const caller = {
    name: await input({ message: "Caller's name:" }),
    image: await input({ message: 'Image URL:' }),
    telegramId: await input({ message: 'Telegram ID:' }),
  };

  console.log('Create caller:', caller);
  await callerService.createCaller(caller);
}

export async function importCallers(callerService: CallerService) {
  try {
    // Read the callers.csv file
    const filePath = path.join(process.cwd(), 'callers.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Parse CSV content
    const callers = parse(fileContent, {
      columns: ['name', 'image', 'telegramId'],
      skip_empty_lines: true,
      trim: true,
    });

    // Create callers
    for (const caller of callers) {
      await callerService.createCaller(caller);
      console.log(`Created caller: ${caller.name}`);
    }

    console.log('All callers imported successfully');
  } catch (error) {
    console.error('Error importing callers:', error);
  }
}
