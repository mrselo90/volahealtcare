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
        images: true,
        beforeAfterImages: true
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Map regular images
    const regularImages = service.images.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      type: (img as any).type || 'gallery' as const
    }));
    
    // Map before/after images - create two entries for each before/after pair
    const beforeAfterImages = service.beforeAfterImages.flatMap(img => [
      {
        id: `${img.id}-before`,
        url: img.beforeImage,
        alt: `Before ${params.slug}`,
        type: 'before-after' as const
      },
      {
        id: `${img.id}-after`,
        url: img.afterImage,
        alt: `After ${params.slug}`,
        type: 'before-after' as const
      }
    ]);

    return NextResponse.json([...regularImages, ...beforeAfterImages]);
  } catch (error) {
    console.error('Error fetching service images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service images' },
      { status: 500 }
    );
  }
}
