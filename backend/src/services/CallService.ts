import { PrismaClient, Call, Prisma } from "@prisma/client";
import { OmitPrisma } from "@src/types";

export class CallService {
    constructor(private prisma: PrismaClient) {}

    async createCall(data: OmitPrisma<Call>): Promise<Call> {
        const call = await this.prisma.call.create({
            data: {
                ...data,
                // Assurez-vous que le champ `data` respecte le type `InputJsonValue`
                data: data.data as Prisma.InputJsonValue,
            },
        });
        return call;
    }

    async getCallsByTelegramId(telegramId: string): Promise<Call[]> {
        const calls = await this.prisma.call.findMany({
            where: {
                caller: {
                    telegramId: telegramId,
                },
            },
        });
        return calls;
    }

    async getCallByTelegramIdAndToken(
        telegramId: string,
        tokenAddress: string
    ): Promise<Call | null> {
        const call = await this.prisma.call.findFirst({
            where: {
                tokenAddress: tokenAddress,
                caller: {
                    telegramId: telegramId,
                },
            },
        });
        return call;
    }

    async getActiveCalls(): Promise<Call[]> {
        const activeCalls = await this.prisma.call.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
        });
        return activeCalls;
    }

    async updateHighestFdvByToken(token: string, newFDV: number): Promise<any> {
        const result = await this.prisma.call.updateMany({
            where: {
                tokenAddress: token,
                highestFDV: { lt: newFDV },
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
            },
            data: {
                highestFDV: newFDV,
                updatedAt: new Date(),
            },
        });
        return result;
    }
}
