import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";

// GET: List all donors in agent's area
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'AGENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const area = session.user.agentArea;
  try {
    const donors = await prisma.donorProfile.findMany({
      where: { area, agentId: session.user.id },
      include: { user: true },
    });
    return NextResponse.json({ donors });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch donors' }, { status: 500 });
  }
}
