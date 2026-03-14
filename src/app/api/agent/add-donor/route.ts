import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// POST: Agent adds a donor to their area
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const agentId = session.user.id;
  const data = await req.json();
  try {
    const donor = await prisma.donorProfile.create({
      data: {
        ...data,
        agentId,
        area: session.user.agentArea || data.area,
        approved: false,
      },
    });
    return NextResponse.json({ donor });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to add donor" }, { status: 500 });
  }
}
