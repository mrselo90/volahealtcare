import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        services: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            price: true,
            currency: true,
            featured: true,
            images: true,
            categoryId: true,
            // Package Details
            timeInTurkey: true,
            operationTime: true,
            hospitalStay: true,
            recovery: true,
            accommodation: true,
            transportation: true,
          },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
