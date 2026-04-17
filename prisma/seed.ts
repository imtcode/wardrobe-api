import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { id: 1 },
    update: {
      name: "Admin",
      email: "admin@wardrobe.com",
      mobile: "1234567890",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      id: 1,
      name: "Admin",
      email: "admin@wardrobe.com",
      mobile: "1234567890",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
