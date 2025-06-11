import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const service = searchParams.get('service');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.categoryId = category;
    }

    if (service) {
      where.serviceId = service;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const cases = await prisma.beforeAfterCase.findMany({
      where,
      include: {
        category: true,
        service: {
          select: {
            title: true,
            slug: true,
          }
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    // Parse tags if they exist
    const casesWithTags = cases.map(caseItem => ({
      ...caseItem,
      tags: caseItem.tags ? JSON.parse(caseItem.tags) : [],
    }));

    return NextResponse.json(casesWithTags);
  } catch (error) {
    console.error('Failed to fetch before/after cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch before/after cases' },
      { status: 500 }
    );
  }
} 