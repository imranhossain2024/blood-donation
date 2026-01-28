"use server";

import { prisma } from "@/lib/prisma";

export async function sendContactMessage(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !message) {
      return { error: "All fields are required" };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending contact message:", error);
    return { error: "Failed to send message" };
  }
}
