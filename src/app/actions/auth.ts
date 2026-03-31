"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { 
  registerSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  profileSchema
} from "@/lib/validators";
import { generateResetToken, hashToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type RegisterState = {
  ok: boolean;
  error?: string | Record<string, string[]>;
};

/**
 * Registers a new user.
 */
export async function registerUser(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = registerSchema.safeParse({ name, email, password });
  if (!validated.success) {
    return {
      ok: false,
      error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        ok: false,
        error: "User with this email already exists.",
      };
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });

    return { ok: true };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return {
      ok: false,
      error: "Something went wrong during registration. Please try again.",
    };
  }
}

/**
 * Requests a password reset for a given email.
 * Returns a generic success message regardless of whether the email exists.
 */
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  const validated = forgotPasswordSchema.safeParse({ email });
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors.email?.[0] || "Invalid email" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Security: Only send if user exists and has a passwordHash (not OAuth only)
    if (user && user.passwordHash) {
      const token = generateResetToken();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Delete existing tokens for this email to prevent spam/clutter
      await prisma.passwordResetToken.deleteMany({
        where: { email },
      });

      await prisma.passwordResetToken.create({
        data: {
          email,
          tokenHash,
          expiresAt,
        },
      });

      await sendPasswordResetEmail(email, token);
    }

    // Always return success for security reasons (prevent account enumeration)
    return { success: "If an account with that email exists, a password reset link has been sent." };
  } catch (error: unknown) {
    console.error("Password reset request error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}

import { z } from "zod";

/**
 * Resets the password using a valid token.
 */
export async function resetPassword(values: z.infer<typeof resetPasswordSchema>) {
  const validated = resetPasswordSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Invalid input data" };
  }

  const { password, token } = validated.data;
  const tokenHash = hashToken(token);

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return { error: "Invalid or expired token" };
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const passwordHash = await hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return { success: "Password successfully updated! You can now log in." };
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}

/**
 * Updates the user's profile information.
 */
export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const validated = profileSchema.safeParse({ name });

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors.name?.[0] || "Invalid name" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    revalidatePath("/profile");
    return { success: "Profile updated successfully!" };
  } catch (error: unknown) {
    console.error("Update profile error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
