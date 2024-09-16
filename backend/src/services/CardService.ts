import { Card, Power, PrismaClient } from '@prisma/client';
import { OmitPrisma } from '@src/types';

export class CardService {
  constructor(private prisma: PrismaClient) {}

  async createCard(data: OmitPrisma<Card, 'powerId'>, powerId: Power['id']) {
    const card = await this.prisma.card.create({
      data: {
        ...data,
        power: {
          connect: { id: powerId },
        },
      },
    });
    return card;
  }

  async getAll(): Promise<Card[]> {
    const cards = await this.prisma.card.findMany({ include: { power: true } });
    return cards;
  }
}

export default CardService;
