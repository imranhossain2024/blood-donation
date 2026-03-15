import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: Agent verifies a donor in their area
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { donorId } = await req.json();
  try {
    const donor = await prisma.donorProfile.update({
      where: { id: donorId, agentId: session.user.id },
      data: { approved: true },
    });
    return NextResponse.json({ donor });
  } catch (error) {
    console.error("Failed to verify donor:", error);
    return NextResponse.json({ error: 'Failed to verify donor' }, { status: 500 });
  }
}
