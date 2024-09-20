import { Claim, PrismaClient } from '@prisma/client';

export class ClaimService {
  constructor(private prisma: PrismaClient) {}

  async createClaim(walletPubkey: string): Promise<Claim> {
    // 1. Get 5 random callers
    const allCallers = await this.prisma.caller.findMany();
    const shuffledCallers = allCallers.sort(() => Math.random() - 0.5);
    const randomCallers = shuffledCallers.slice(0, 5);

    // 2. Create portfolio with random balances
    const portfolio = randomCallers.map((caller, index) => {
      let balance;
      if (index === 0) {
        balance = 3_000_000;
      } else if (index === 1 || index === 2) {
        balance = 1_000_000;
      } else {
        balance = 100_000;
      }
      return {
        callerId: caller.id,
        balance: balance,
      };
    });

    console.log(
      `Random portfolio created for wallet: ${walletPubkey}`,
      portfolio
    );

    // 3. Store data as claim object
    return this.prisma.claim.create({
      data: {
        walletPubkey,
        portfolio: portfolio,
      },
    });
  }

  async claim(walletPubkey: string): Promise<Claim> {
    let claim = await this.prisma.claim.findUnique({
      where: {
        walletPubkey: walletPubkey,
      },
    });

    if (!claim) {
      claim = await this.createClaim(walletPubkey);
    }

    return claim;
  }
}
