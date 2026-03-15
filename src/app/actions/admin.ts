"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
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

  await prisma.user.update({
    where: { id: userId },
    data: { role: approved ? "DONOR" : "USER" },
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

  // If unblocking, we don't necessarily want to auto-approve,
  // but if blocking, we definitely want to demote to USER.
  if (blocked) {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "USER" },
    });
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/donors");
  revalidatePath("/donors");
}

export async function deleteBloodRequest(requestId: string) {
  await assertAdmin();

  await prisma.bloodRequest.delete({
    where: { id: requestId },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/requests");
  revalidatePath("/dashboard/requests");
}

export async function adminUpdateRequestStatus(requestId: string, status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED") {
  await assertAdmin();

  await prisma.bloodRequest.update({
    where: { id: requestId },
    data: { status },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/requests");
  revalidatePath("/dashboard/requests");
}
