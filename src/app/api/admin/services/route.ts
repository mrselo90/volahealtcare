import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all services or a single service by slug
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if we're looking for a specific service by slug
    const { pathname } = new URL(request.url);
    const slugMatch = pathname.match(/\/api\/admin\/services\/([\w-]+)/);
    const slug = slugMatch ? slugMatch[1] : null;

    if (slug) {
      // Get a single service by slug
      const service = await prisma.service.findUnique({
        where: { slug },
        include: {
          translations: true,
          images: true,
          faqs: {
            include: {
              translations: true,
            },
          },
          beforeAfterImages: true,
        },
      });

      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(service);
    }

    // Get all services
    const services = await prisma.service.findMany({
      include: {
        translations: true,
        images: true,
        faqs: {
          include: {
            translations: true,
          },
        },
        beforeAfterImages: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// Create new service
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('POST /api/admin/services request body:', JSON.stringify(data, null, 2));
    const { translations = [], images = [], faqs = [], beforeAfterImages = [], ...serviceData } = data;

    // Look up the category by ID (categoryId from form)
    const category = await prisma.category.findUnique({
      where: { id: serviceData.categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate a unique slug by adding a timestamp
    const baseSlug = translations.find((t: any) => t.language === 'en')?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
    const timestamp = Date.now();
    const uniqueSlug = `${baseSlug}-${timestamp}`;

    // Create service with translations and images
    const service = await prisma.service.create({
      data: {
        ...serviceData,
        category: {
          connect: { id: category.id }
        },
        slug: uniqueSlug,
        translations: {
          create: translations.map((translation: any) => ({
            language: translation.language,
            title: translation.title,
            description: translation.description,
            content: translation.content || '',
          })),
        },
        images: {
          create: images.filter((image: any) => !!image.url).map((image: any) => ({
            url: image.url,
            alt: image.alt || '',
          })),
        },
        faqs: {
          create: faqs.map((faqItem: any) => ({
            translations: {
              create: faqItem.translations.map((translation: any) => ({
                language: translation.language,
                question: translation.question,
                answer: translation.answer,
              })),
            },
          })),
        },
        beforeAfterImages: {
          create: beforeAfterImages.map((image: any) => ({
            beforeImage: image.beforeImage,
            afterImage: image.afterImage,
            description: image.description || '',
          })),
        },
      },
      include: {
        translations: true,
        images: true,
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
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service', details: (error as any)?.message || String(error) },
      { status: 500 }
    );
  }
}

// Update service
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('PUT /api/admin/services request body:', JSON.stringify(data, null, 2));
    const { id, categoryId, translations = [], images = [], faqs = [], beforeAfterImages = [], ...serviceData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // First, check if the service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true,
        images: true,
        faqs: {
          include: {
            translations: true,
          },
        },
        beforeAfterImages: true,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Look up the category by ID (categoryId from form)
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if the slug needs to be updated and ensure uniqueness
    let slug = serviceData.slug;
    if (slug !== existingService.slug) {
      const baseSlug = translations.find((t: any) => t.language === 'en')?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
      const timestamp = Date.now();
      slug = `${baseSlug}-${timestamp}`;
    }

    // Update service with all relations
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...serviceData,
        category: {
          connect: { id: category.id }
        },
        slug,
        translations: {
          deleteMany: {},
          create: translations.map((translation: any) => ({
            language: translation.language,
            title: translation.title,
            description: translation.description,
            content: translation.content || '',
          })),
        },
        images: {
          deleteMany: {},
          create: images.filter((image: any) => !!image.url).map((image: any) => ({
            url: image.url,
            alt: image.alt || '',
          })),
        },
        faqs: {
          deleteMany: {},
          create: faqs.map((faqItem: any) => ({
            question: faqItem.question,
            answer: faqItem.answer,
            translations: {
              create: faqItem.translations.map((translation: any) => ({
                language: translation.language,
                question: translation.question,
                answer: translation.answer,
              })),
            },
          })),
        },
        beforeAfterImages: {
          deleteMany: {},
          create: beforeAfterImages.map((image: any) => ({
            beforeImage: image.beforeImage,
            afterImage: image.afterImage,
            description: image.description || '',
          })),
        },
      },
      include: {
        translations: true,
        images: true,
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
      { error: 'Failed to update service', details: (error as any)?.message || String(error) },
      { status: 500 }
    );
  }
}

// Delete service
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Delete related records first to avoid foreign key constraint violations
    await prisma.$transaction(async (tx) => {
      // Delete appointments
      await tx.appointment.deleteMany({
        where: { serviceId: id }
      });

      // Delete testimonials
      await tx.testimonial.deleteMany({
        where: { serviceId: id }
      });

      // Delete before after cases
      await tx.beforeAfterCase.deleteMany({
        where: { serviceId: id }
      });

      // Delete FAQ translations first, then FAQs
      const faqs = await tx.fAQ.findMany({
        where: { serviceId: id },
        select: { id: true }
      });
      
      for (const faq of faqs) {
        await tx.fAQTranslation.deleteMany({
          where: { faqId: faq.id }
        });
      }
      
      await tx.fAQ.deleteMany({
        where: { serviceId: id }
      });

      // Delete service translations
      await tx.serviceTranslation.deleteMany({
        where: { serviceId: id }
      });

      // Delete images
      await tx.image.deleteMany({
        where: { serviceId: id }
      });

      // Delete before after images
      await tx.beforeAfterImage.deleteMany({
        where: { serviceId: id }
      });

      // Finally delete the service
      await tx.service.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
} 