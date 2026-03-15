"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function makeAdminByEmail(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { ok: false, error: "Unauthorized" };
  }

  const email = formData.get("email")?.toString().trim().toLowerCase();
  if (!email) {
    return { ok: false, error: "Email is required." };
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { ok: false, error: "User not found." };
  }
  await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
  revalidatePath("/makeadmin");
  return { ok: true };
}
