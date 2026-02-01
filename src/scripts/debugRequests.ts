
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugRequests() {
  const agentEmail = process.argv[2];
  if (!agentEmail) {
    console.log("Usage: npx tsx src/scripts/debugRequests.ts <agent_email>");
    process.exit(1);
  }

  const agent = await prisma.user.findUnique({
    where: { email: agentEmail },
    select: { id: true, name: true, role: true, agentArea: true }
  });

  if (!agent) {
    console.error("Agent not found!");
    process.exit(1);
  }

  console.log("\n--- Agent Info ---");
  console.log(JSON.stringify(agent, null, 2));

  console.log("\n--- Checking ALL PENDING Requests (No location filter) ---");
  const allPending = await prisma.bloodRequest.findMany({
    where: { status: "PENDING" },
    select: { id: true, location: true, status: true }
  });
  console.log(`Found ${allPending.length} total pending requests.`);
  if (allPending.length > 0) {
    console.log("Sample locations:", allPending.map(r => r.location).join(", "));
  }

  console.log("\n--- Checking Filtered Requests (With agentArea) ---");
  const filtered = await prisma.bloodRequest.findMany({
    where: {
      status: "PENDING",
      location: {
        contains: agent.agentArea ?? "",
        mode: "insensitive"
      }
    }
  });

  console.log(`Found ${filtered.length} requests for area: "${agent.agentArea}"`);
  
  console.log("\n--- WHY IS IT ZERO? ---");
  const agentArea = agent.agentArea ?? "";
  console.log(`AgentArea: "${agentArea}" | Hex: ${Buffer.from(agentArea).toString("hex")}`);

  allPending.forEach(req => {
    const loc = req.location;
    const isMatch = loc.toLowerCase().includes(agentArea.toLowerCase());
    console.log(`- Req Location: "${loc}" | Hex: ${Buffer.from(loc).toString("hex")}`);
    console.log(`  Match? ${isMatch ? "YES" : "NO"}`);
  });
}

debugRequests()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
