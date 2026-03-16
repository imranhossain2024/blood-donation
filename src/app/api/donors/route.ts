import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AvailabilityStatus, BloodGroup, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
            ] as Prisma.DonorProfileWhereInput["OR"],
          }
        : {}),
    },
    include: {
      user: {
        select: { id: true, name: true, image: true, role: true }, // Emails hidden for privacy
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(donors);
}

