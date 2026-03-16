
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const role = (args[1] || "AGENT").toUpperCase() as Role;
  const area = args[2]; // Optional area for Agents

  if (!email) {
    console.error("Usage: npx tsx src/scripts/promoteUser.ts <email> [ROLE] [AREA]");
    console.error("Example: npx tsx src/scripts/promoteUser.ts user@example.com AGENT 'Dhaka'");
    process.exit(1);
  }

  if (!Object.values(Role).includes(role)) {
    console.error(`Invalid role. Available roles: ${Object.values(Role).join(", ")}`);
    process.exit(1);
  }

  console.log(`Looking for user with email: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error("Error: User not found!");
    process.exit(1);
  }

  console.log(`Found user: ${user.name} (${user.role})`);
  console.log(`Promoting to ${role}...`);

  const updateData: import("@prisma/client").Prisma.UserUpdateInput = { role };
  
  if (role === 'AGENT' && area) {
    console.log(`Setting Agent Area to: ${area}`);
    updateData.agentArea = area;
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: updateData,
  });

  console.log(`Success! User ${updatedUser.email} is now an ${updatedUser.role}.`);
  if (updatedUser.role === 'AGENT' && updatedUser.agentArea) {
    console.log(`Agent Area: ${updatedUser.agentArea}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
