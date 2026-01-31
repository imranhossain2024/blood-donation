"use server";

import { prisma } from "@/lib/prisma";
import { profileSchema, registerSchema } from "@/lib/validators";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type RegisterState = {
  ok: boolean;
  error?: Record<string, string[]> | string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
) {
  try {
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return { ok: false, error: parsed.error.flatten().fieldErrors };
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return { ok: false, error: { email: ["Email already exists"] } };
    }

    const passwordHash = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return { ok: false, error: "Registration failed. Please try again later." };
  }

  redirect("/login?registered=1");
}

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return { ok: true };
}
