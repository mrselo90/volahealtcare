import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const exclude = searchParams.get('exclude');
    const limit = searchParams.get('limit');

    // Build where clause
    const where: any = {};
    
    if (category) {
      // Find category by slug
      const categoryRecord = await prisma.category.findFirst({
        where: { slug: category }
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }
    
    if (exclude) {
      where.NOT = { id: exclude };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        translations: true,
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            type: true,
          }
        },
        category: {
          select: {
            id: true,
            slug: true,
            name: true,
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: parseInt(limit) } : {}),
    });
    
    // Create response with caching headers
    const response = NextResponse.json(services);
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('CDN-Cache-Control', 'public, s-maxage=300');
    response.headers.set('Vary', 'Accept-Encoding');
    
    return response;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { category, translations, images, ...serviceData } = data;

    // Prepare images creation
    let imagesCreate = undefined;
    if (Array.isArray(images) && images.length > 0) {
      imagesCreate = {
        create: images.map(({ id, ...img }) => img),
      };
    }

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        categoryId: category, // Use categoryId instead of category
        ...(imagesCreate ? { images: imagesCreate } : {}),
        translations: {
          create: translations,
        },
      },
      include: {
        translations: true,
        images: true,
        category: true,
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json(
      { error: 'Failed to create service', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, translations, images, category, updateImages, ...serviceData } = data;

    console.log('=== API DEBUG INFO ===');
    console.log('Request contains images:', 'images' in data);
    console.log('updateImages flag:', updateImages);
    console.log('Images array:', images);
    console.log('Images is array:', Array.isArray(images));
    console.log('Images length:', images?.length);
    console.log('======================');

    // Handle category - use categoryId instead of category
    const updateData = {
      ...serviceData,
      ...(category ? { categoryId: category } : {}),
    };

    // Get current service to check existing images
    const currentService = await prisma.service.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!currentService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // ONLY update images if explicitly requested with updateImages flag
    let imagesUpdate = undefined;
    if (updateImages === true && Array.isArray(images)) {
      console.log('Updating images because updateImages flag is true');
      imagesUpdate = {
        deleteMany: {}, // delete all existing images for this service
        create: images.filter(img => img.url).map(({ id, ...img }) => ({
          ...img,
          alt: img.alt || '',
          type: img.type || 'gallery'
        })), // create new images (ignore empty id and ensure required fields)
      };
    } else {
      console.log('Preserving existing images - no updateImages flag');
    }

    // Prepare faqs and beforeAfterImages update logic
    // Only include faqs and beforeAfterImages if non-empty arrays
    let faqsUpdate = undefined;
    if (Array.isArray(data.faqs) && data.faqs.length > 0) {
      faqsUpdate = {
        deleteMany: {},
        create: data.faqs.map(({ id, ...faq }: { id: string }) => faq),
      };
    }
    let beforeAfterImagesUpdate = undefined;
    if (Array.isArray(data.beforeAfterImages) && data.beforeAfterImages.length > 0) {
      beforeAfterImagesUpdate = {
        deleteMany: {},
        create: data.beforeAfterImages.map(({ id, ...img }: { id: string }) => img),
      };
    }

    // Update the service
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...updateData,
        ...(imagesUpdate ? { images: imagesUpdate } : {}),
        ...(faqsUpdate ? { faqs: faqsUpdate } : {}),
        ...(beforeAfterImagesUpdate ? { beforeAfterImages: beforeAfterImagesUpdate } : {}),
        translations: {
          deleteMany: {},
          create: translations,
        },
      },
      include: {
        translations: true,
        images: true,
        category: true,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json(
      { error: 'Failed to update service', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
} 