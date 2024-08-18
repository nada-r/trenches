import { PrismaClient, Power, Card, User} from "@prisma/client";
import { omitPrisma } from "./types";

console.log("!here");
const prisma = new PrismaClient();




async function main() {
    // // Show connection status
    // const isConnected = await prisma.$connect().then(() => true).catch(() => false);
    // console.log("!Prisma connection status:", isConnected ? "Connected" : "Not Connected");

    // const response = await prisma.test.findUnique({
    //     where: { id: 3 }
    // });
    // console.log("!response client", response);
    
    //await createUser({name: "test", walletString: "test"});
    //await createPower({name: "test", value: 433});
    //await createCard({name: "rug", price: 3, image: "src/image.com"}, 1, 1);
}

main().catch(e => console.error("!Unhandled error in main:", e));