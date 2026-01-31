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

  await prisma.donorProfile.upsert({
    where: { userId: session.user.id },
    update: {
      bloodGroup,
      location,
      phone,
      availability: availability ?? "AVAILABLE",
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
    },
    create: {
      userId: session.user.id,
      bloodGroup,
      location,
      phone,
      availability: availability ?? "AVAILABLE",
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "DONOR" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/donor");
  revalidatePath("/donors");

  return { ok: true };
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
