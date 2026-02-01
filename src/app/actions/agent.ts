"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function assertAgent() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "AGENT") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function agentApproveDonor(donorId: string) {
  await assertAgent();

  await prisma.donorProfile.update({
    where: { id: donorId },
    data: { approved: true },
  });

  revalidatePath("/dashboard/agent");
  revalidatePath(`/dashboard/agent/donor/${donorId}`);
}

export async function approveRequest(requestId: string) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "AGENT") {
    return { error: "Unauthorized" };
  }

  try {
    const request = await prisma.bloodRequest.update({
      where: { id: requestId },
      data: { status: "ACCEPTED" },
    });

    revalidatePath("/dashboard/agent");
    revalidatePath("/dashboard/agent/requests");
    return { success: true, request };
  } catch (error) {
    console.error("Failed to approve request:", error);
    return { error: "Failed to approve request" };
  }
}
