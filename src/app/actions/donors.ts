"use server";

import { prisma } from "@/lib/prisma";
import { AvailabilityStatus, BloodGroup } from "@prisma/client";

export async function getDonorsAction(params: {
  bloodGroup?: string;
  location?: string;
  availability?: string;
  page?: number;
}) {
  const { bloodGroup, location, availability, page = 1 } = params;
  const whereClause = {
    approved: true,
    blocked: false,
    ...(bloodGroup ? { bloodGroup: bloodGroup as BloodGroup } : {}),
    ...(availability ? { availability: availability as AvailabilityStatus } : {}),
    ...(location ? { location: { contains: location, mode: "insensitive" as const } } : {}),
  };

  const PAGE_SIZE = 12;
  const skip = (page - 1) * PAGE_SIZE;

  const [donors, total] = await Promise.all([
     prisma.donorProfile.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, image: true, email: true, phone: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.donorProfile.count({ where: whereClause }),
  ]);

  return { donors, total };
}
