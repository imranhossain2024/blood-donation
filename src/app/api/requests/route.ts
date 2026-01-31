import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;

  const requests = await prisma.bloodRequest.findMany({
    where: status && Object.values(RequestStatus).includes(status as RequestStatus) 
      ? { status: status as RequestStatus } 
      : undefined,
    include: {
      requester: { select: { id: true, name: true, email: true } },
      donor: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}
