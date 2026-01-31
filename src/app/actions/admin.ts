"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function setDonorApproval(userId: string, approved: boolean) {
  await assertAdmin();

  await prisma.donorProfile.update({
    where: { userId },
    data: { approved, blocked: false },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/donors");

}

export async function setDonorBlocked(userId: string, blocked: boolean) {
  await assertAdmin();

  await prisma.donorProfile.update({
    where: { userId },
    data: { blocked, ...(blocked ? { approved: false } : {}) },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/donors");

}

export async function adminUpdateRequestStatus(requestId: string, status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED") {
  await assertAdmin();

  await prisma.bloodRequest.update({
    where: { id: requestId },
    data: { status },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/requests");

}
