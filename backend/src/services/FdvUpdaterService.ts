export class FdvUpdaterService {
  constructor() {}

  async getHighestMcap(
    history: { timestamp: number; highest: number }[],
    after: number
  ): Promise<number> {
    let highestMcap = 0;
    for (const entry of history) {
      if (entry.timestamp > after && entry.highest > highestMcap) {
        highestMcap = entry.highest;
      }
    }
    return highestMcap;
  }
}
