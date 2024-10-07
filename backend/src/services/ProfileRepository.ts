import { Claim, Player, PrismaClient } from '@prisma/client';

export class ProfileRepository {
  constructor(private prisma: PrismaClient) {}

  public async createClaim(walletPubkey: string): Promise<Claim> {
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

  public async claim(walletPubkey: string): Promise<Claim> {
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

  public async getProfile(walletPubkey: string): Promise<Player | null> {
    return this.prisma.player.findUnique({
      where: { walletPubkey },
    });
  }

  public async followCaller(
    walletPubkey: string,
    callerId: number
  ): Promise<Player> {
    let player = await this.prisma.player.findUnique({
      where: { walletPubkey },
    });

    if (!player) {
      // Create a new player if not exists
      player = await this.prisma.player.create({
        data: {
          walletPubkey,
          data: { favorites: [] },
        },
      });
    }

    const currentPortfolio = player.data as { favorites: number[] };
    const updatedFavorites = [
      ...new Set([...currentPortfolio.favorites, callerId]),
    ];

    return this.prisma.player.update({
      where: { walletPubkey },
      data: {
        data: {
          ...player.data,
          favorites: updatedFavorites,
        },
      },
    });
  }

  public async unfollowCaller(
    walletPubkey: string,
    callerId: number
  ): Promise<Player> {
    let player = await this.prisma.player.findUnique({
      where: { walletPubkey },
    });

    if (!player) {
      throw new Error('Player not found');
    }

    const currentPortfolio = player.data as { favorites: number[] };
    const updatedFavorites = currentPortfolio.favorites.filter(
      (id) => id !== callerId
    );

    return this.prisma.player.update({
      where: { walletPubkey },
      data: {
        data: {
          ...player.data,
          favorites: updatedFavorites,
        },
      },
    });
  }
}
