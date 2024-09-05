import { PrismaClient, Power } from "@prisma/client";
import { omitPrisma } from "../types";

export class PowerService {
  constructor(private prisma: PrismaClient) {}

  async createPower(data: omitPrisma<Power>) {
    const power = await this.prisma.power.create({
      data,
    });
    return power;
  }
}

export default PowerService;
