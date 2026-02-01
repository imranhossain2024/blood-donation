"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { donorProfileSchema } from "@/lib/validators";

export type DonorProfileState = {
  ok: boolean;
  error?: Record<string, string[]> | string;
};

export async function upsertDonorProfile(
  _prevState: DonorProfileState,
  formData: FormData
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = donorProfileSchema.safeParse({
    bloodGroup: formData.get("bloodGroup"),
    location: formData.get("location"),
    phone: formData.get("phone"),
    availability: formData.get("availability"),
    lastDonationDate: formData.get("lastDonationDate"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }

  const { bloodGroup, location, phone, availability, lastDonationDate } = parsed.data;

  try {
    // We update the user's phone number and its nested donorProfile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        phone,
        role: "DONOR",
        donorProfile: {
          upsert: {
            create: {
              bloodGroup,
              location,
              availability: availability ?? "AVAILABLE",
              lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
            },
            update: {
              bloodGroup,
              location,
              availability: availability ?? "AVAILABLE",
              lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
            },
          },
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/donor");
    revalidatePath("/donors");

    return { ok: true };
  } catch (error) {
    console.error("Donor profile update failed:", error);
    return { ok: false, error: "Failed to save profile. Please ensure your database is synced." };
  }
}

export async function setAvailability(status: "AVAILABLE" | "UNAVAILABLE") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  await prisma.donorProfile.update({
    where: { userId: session.user.id },
    data: { availability: status },
  });

  revalidatePath("/dashboard/donor");
  revalidatePath("/donors");

  return { ok: true };
}
