import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const contentBlocks = await prisma.contentBlock.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });

    return NextResponse.json(contentBlocks);
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch content blocks' }, { status: 500 });
  }
} 