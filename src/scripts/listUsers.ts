
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: "tareq", mode: "insensitive" } },
        { name: { contains: "tareq", mode: "insensitive" } }
      ]
    },
    select: { email: true, name: true, role: true }
  });
  console.log("Found users:", JSON.stringify(users, null, 2));
}
main().finally(() => prisma.$disconnect());
