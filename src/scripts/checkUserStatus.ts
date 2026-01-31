
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "tareqhassan@gmail.com";
  console.log(`Checking status for ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { 
      name: true, 
      email: true, 
      role: true, 
      agentArea: true 
    }
  });

  if (!user) {
    console.log("User not found.");
  } else {
    console.log("User Details:");
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    console.log(`Agent Area: ${user.agentArea || "Not Set"}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
