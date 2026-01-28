"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function makeAdminByEmail(formData: FormData) {
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
