import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const contentBlocks = await prisma.contentBlock.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: 'asc' }
    });

    const response = NextResponse.json(contentBlocks);
    
    // Cache for 10 minutes with stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    
    return response;
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch content blocks' }, { status: 500 });
  }
} 