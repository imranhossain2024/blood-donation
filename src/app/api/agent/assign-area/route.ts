import { authOptions } from '@/lib/auth';
import { prisma } from "@/lib/prisma";
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: Admin assigns an area to an agent
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { agentId, area } = await req.json();
  try {
    const agent = await prisma.user.update({
      where: { id: agentId, role: 'AGENT' },
      data: { agentArea: area },
    });
    return NextResponse.json({ agent });
  } catch (error) {
    console.error("Failed to assign area:", error);
    return NextResponse.json({ error: 'Failed to assign area' }, { status: 500 });
  }
}
