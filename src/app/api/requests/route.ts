import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;

  const requests = await prisma.bloodRequest.findMany({
    where: status && Object.values(RequestStatus).includes(status as RequestStatus) 
      ? { status: status as RequestStatus } 
      : {},
    include: {
      requester: { select: { id: true, name: true, image: true } }, // Removed email for privacy
      donor: { select: { id: true, name: true, image: true } }, // Removed email for privacy
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}
