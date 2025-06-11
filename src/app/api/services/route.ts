import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        translations: true,
        images: true,
        category: true,
      },
    });
    return NextResponse.json(services);
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
        deleteMany: {}, // delete all existing images for this service
        create: images.map(({ id, ...img }) => img), // create new images (ignore empty id)
      };
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