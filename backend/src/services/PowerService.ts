import { Power, PrismaClient } from '@prisma/client';
import { OmitPrisma } from '../types';

export class PowerService {
  constructor(private prisma: PrismaClient) {}

  async createPower(data: OmitPrisma<Power>) {
    const power = await this.prisma.power.create({
      data,
    });
    return power;
  }
}

export default PowerService;
