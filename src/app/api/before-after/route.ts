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
      // Handle both category ID and category slug/name
      if (category.length > 10) {
        // Looks like a database ID
        where.categoryId = category;
      } else {
        // First try exact slug match
        let categoryRecord = await prisma.category.findFirst({
          where: { slug: category }
        });
        
        if (!categoryRecord) {
          // Try with -treatments suffix
          categoryRecord = await prisma.category.findFirst({
            where: { slug: `${category}-treatments` }
          });
        }
        
        if (!categoryRecord) {
          // Try partial matches
          const allCategories = await prisma.category.findMany();
          categoryRecord = allCategories.find(cat => 
            cat.slug.includes(category) || 
            category.includes(cat.slug.split('-')[0]) ||
            cat.name.toLowerCase().includes(category.toLowerCase())
          );
        }
        
        if (categoryRecord) {
          where.categoryId = categoryRecord.id;
        } else {
          // If no category found, return empty results
          const response = NextResponse.json([]);
          // Cache empty results for shorter time
          response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
          return response;
        }
      }
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

    // Parse tags and category names if they exist
    const casesWithParsedData = cases.map(caseItem => ({
      ...caseItem,
      tags: caseItem.tags ? JSON.parse(caseItem.tags) : [],
      category: caseItem.category ? {
        ...caseItem.category,
        // Parse category name if it's JSON
        name: (() => {
          try {
            const parsedName = JSON.parse(caseItem.category.name);
            return parsedName.en || parsedName.tr || caseItem.category.name;
          } catch {
            return caseItem.category.name;
          }
        })(),
        // Parse description if it's JSON
        description: (() => {
          try {
            const parsedDesc = JSON.parse(caseItem.category.description || '{}');
            return parsedDesc.en || parsedDesc.tr || caseItem.category.description;
          } catch {
            return caseItem.category.description;
          }
        })()
      } : null,
    }));

    // Create response with optimized caching
    const response = NextResponse.json(casesWithParsedData);
    
    // Cache before/after cases for 10 minutes (longer than other APIs since they change less frequently)
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=600');
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;
  } catch (error) {
    console.error('Failed to fetch before/after cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch before/after cases' },
      { status: 500 }
    );
  }
} 