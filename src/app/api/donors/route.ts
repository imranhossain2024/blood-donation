import { prisma } from "@/lib/prisma";
import { AvailabilityStatus, BloodGroup } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bloodGroup = searchParams.get("bloodGroup") || undefined;
  const location = searchParams.get("location") || undefined;
  const availability = searchParams.get("availability") || undefined;
  const keyword = searchParams.get("keyword")?.trim() || undefined;

  const donors = await prisma.donorProfile.findMany({
    where: {
      approved: true,
      blocked: false,
      ...(bloodGroup ? { bloodGroup: bloodGroup as BloodGroup } : {}),
      ...(availability ? { availability: availability as AvailabilityStatus } : {}),
      ...(location
        ? {
            location: {
              contains: location,
              mode: "insensitive",
            },
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              { location: { contains: keyword, mode: "insensitive" } },
              { user: { name: { contains: keyword, mode: "insensitive" } } },
              { user: { email: { contains: keyword, mode: "insensitive" } } },
            ] as any, // Cast to any to bypass complex Prisma union type mismatch
          }
        : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, image: true, role: true }, // Removed email for privacy
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(donors);
}

