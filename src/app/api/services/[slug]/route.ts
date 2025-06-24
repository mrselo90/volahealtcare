import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
      include: {
        translations: true,
        images: true,
        category: {
          select: {
            id: true,
            slug: true,
            name: true,
          }
        },
      },
    });

    if (!service) {
      const notFoundResponse = NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
      // Cache 404 responses for shorter time
      notFoundResponse.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      return notFoundResponse;
    }

    // Create response with caching headers
    const response = NextResponse.json(service);
    
    // Cache individual services for 15 minutes (they don't change often)
    response.headers.set('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=900');
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
} 