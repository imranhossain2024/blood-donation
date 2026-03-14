"use server";

import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { bloodGroupLabels } from "@/lib/utils";
import { bloodRequestSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createBloodRequest(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const parsed = bloodRequestSchema.safeParse({
    bloodGroup: formData.get("bloodGroup"),
    units: formData.get("units"),
    location: formData.get("location"),
    neededAt: formData.get("neededAt"),
    note: formData.get("note"),
    donorId: formData.get("donorId"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }

  const { bloodGroup, units, location, neededAt, note, donorId } = parsed.data;

  const request = await prisma.bloodRequest.create({
    data: {
      requesterId: session.user.id,
      donorId: donorId || null,
      bloodGroup,
      units,
      location,
      neededAt: new Date(neededAt),
      note: note || null,
    },
  });

  if (donorId) {
    const groupLabel = bloodGroupLabels[bloodGroup] ?? bloodGroup;
    const donor = await prisma.user.findUnique({
      where: { id: donorId },
    });

    if (donor?.email) {
      await prisma.notification.create({
        data: {
          userId: donorId,
          title: "New blood request",
          message: `You have a new request for ${groupLabel} blood.`,
          type: "REQUEST",
        },
      });

      await sendEmail({
        to: donor.email,
        subject: "New blood request",
        text: `A new blood request has been created for ${groupLabel} blood. Please review it in your dashboard.`,
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/requests");

  return { ok: true, id: request.id };
}

export async function respondToRequest(requestId: string, status: "ACCEPTED" | "REJECTED") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const request = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
    include: { requester: true },
  });

  if (!request || request.donorId !== session.user.id) {
    return { ok: false, error: "Not allowed" };
  }

  const updated = await prisma.bloodRequest.update({
    where: { id: requestId },
    data: { status },
  });

  await prisma.notification.create({
    data: {
      userId: request.requesterId,
      title: "Request update",
      message: `Your request has been ${status.toLowerCase()}.`,
      type: "STATUS",
    },
  });

  if (request.requester.email) {
    await sendEmail({
      to: request.requester.email,
      subject: "Blood request update",
      text: `Your request has been ${status.toLowerCase()}.`,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/donor");

  return { ok: true, status: updated.status };
}

export async function markRequestCompleted(requestId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const request = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    return { ok: false, error: "Request not found" };
  }

  if (request.donorId !== session.user.id && session.user.role !== "ADMIN") {
    return { ok: false, error: "Not allowed" };
  }

  await prisma.bloodRequest.update({
    where: { id: requestId },
    data: { status: "COMPLETED" },
  });

  if (request.donorId) {
    await prisma.donationHistory.create({
      data: {
        donorId: request.donorId,
        requesterId: request.requesterId,
        requestId: request.id,
        units: request.units,
        note: request.note || null,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/donor");

  return { ok: true };
}

export async function cancelRequest(requestId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  const request = await prisma.bloodRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.requesterId !== session.user.id) {
    return { ok: false, error: "Not allowed" };
  }

  await prisma.bloodRequest.update({
    where: { id: requestId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/requests");

  return { ok: true };
}
