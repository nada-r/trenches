import { PrismaClient, Power, Card, User} from "@prisma/client";
import { omitPrisma } from "./types";
import { CardService, UserService, PowerService } from "./services";
import bootStrap from './bootstrap';

console.log("!here");

async function main() {
    await bootStrap();
    const prisma = new PrismaClient();
    // Show connection status
    const isConnected = await prisma.$connect().then(() => true).catch(() => false);
    console.log("!Prisma connection status:", isConnected ? "Connected" : "Not Connected");

    // const response = await prisma.test.findUnique({
    //     where: { id: 3 }
    // });
    // console.log("!response client", response);
    const cardService = new CardService(prisma);
    const powerService = new PowerService(prisma);
    const userService = new UserService(prisma);
    {/*await userService.createUser({name: "dumbledior", walletString: "DeAW7SyArr7Stk2U6NL8EtoXaLNPyG3wfkVfRzvcPG4S"})*/}
    console.log(await powerService.createPower({name: "luigiscalls", value: 736}));
    await cardService.createCard({name: "luigiscalls", price: 7, image: "https://trenches.fra1.cdn.digitaloceanspaces.com/Luigicall.jpg"}, 5, 1);
}

main().catch(e => console.error("!Unhandled error in main:", e));