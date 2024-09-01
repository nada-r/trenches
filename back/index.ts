import { PrismaClient } from "@prisma/client";

console.log("!here");
const prisma = new PrismaClient();

async function main() {
    // Show connection status
    const isConnected = await prisma.$connect().then(() => true).catch(() => false);
    console.log("!Prisma connection status:", isConnected ? "Connected" : "Not Connected");

    const response = await prisma.test.findUnique({
        where: { id: 3 }
    });
    console.log("!response client", response);
}

main().catch(e => console.error("!Unhandled error in main:", e));