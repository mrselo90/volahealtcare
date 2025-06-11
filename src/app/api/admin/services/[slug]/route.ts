import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
  const { slug } = params;
    
    // Fetch service from database with all relations
    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        translations: true,
        images: true,
        category: true,
        faqs: {
          include: {
            translations: true,
          },
        },
        beforeAfterImages: true,
      },
    });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const data = await req.json();
    const { id, translations, images, category, ...serviceData } = data;

    // Handle category - use categoryId instead of category
    const updateData = {
      ...serviceData,
      ...(category ? { categoryId: category } : {}),
    };

    // Prepare images update logic
    let imagesUpdate = undefined;
    if (Array.isArray(images)) {
      imagesUpdate = {
        deleteMany: {},
        create: images.map(({ id, ...img }) => img),
      };
    }

    // Prepare faqs update logic
    let faqsUpdate = undefined;
    if (Array.isArray(data.faqs) && data.faqs.length > 0) {
      faqsUpdate = {
        deleteMany: {},
        create: data.faqs.map(({ id, ...faq }) => faq),
      };
    }

    // Prepare beforeAfterImages update logic
    let beforeAfterImagesUpdate = undefined;
    if (Array.isArray(data.beforeAfterImages) && data.beforeAfterImages.length > 0) {
      beforeAfterImagesUpdate = {
        deleteMany: {},
        create: data.beforeAfterImages.map(({ id, ...img }) => img),
      };
    }

    // Update the service by slug
    const service = await prisma.service.update({
      where: { slug },
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
        faqs: {
          include: {
            translations: true,
          },
        },
        beforeAfterImages: true,
      },
    });

  return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    // Delete the service by slug
    await prisma.service.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
