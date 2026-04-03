import "dotenv/config"
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg"

const { Pool } = pg;

// Debug (remove later)
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    max:5,
})

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
    ? ["query" , "error", "warn"]
    : ["error"]
});

const connectDB = async() =>{
    try {
        console.log("Connecting to Database....")
        await prisma.$connect();
        console.log("DB connection Sucessfully via Prisma ")
    } catch (error) {
        console.log(`DB connection Error:${error}`)
        process.exit(1);
    }
}

const disconnectDB = async() =>{
    try {
        await prisma.$disconnect();
        console.log("DB Disconnected Sucessfully")
    } catch (error) {
        console.error("Error while disconnecting DB:",error.message)
    }
}

export { prisma , connectDB , disconnectDB }