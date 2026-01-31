"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reportTarget(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  const type = formData.get("type") as string;
  const targetId = formData.get("targetId") as string;
  const reason = formData.get("reason") as string;
  const reporterPhone = formData.get("reporterPhone") as string;

  if (!type || !targetId || !reason) {
    return { ok: false, error: "Missing required fields" };
  }

  await prisma.report.create({
    data: {
      type,
      targetId,
      reason,
      reporterId: session?.user?.id || null,
      reporterPhone: reporterPhone || null,
    },
  });

  revalidatePath("/dashboard/admin");

  return { ok: true };
}

export async function dismissReport(reportId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return { ok: false };

  await prisma.report.delete({
    where: { id: reportId },
  });

  revalidatePath("/dashboard/admin");
  return { ok: true };
}
