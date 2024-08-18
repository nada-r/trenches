import { PrismaClient, Card, Power, User } from "@prisma/client";

export class CardService {
  constructor(private prisma: PrismaClient) {}

  async createCard(data: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'power' | 'owner' | 'powerId' | 'ownerId'>, powerId: Power["id"], userId: User["id"])
   {
    const card = await this.prisma.card.create({
      data: {
        ...data,
        power: {
          connect: { id: powerId }
        },
        owner: {
          connect: { id: userId }
        }
      }
    });
    return card;
  }
}

export default CardService;
