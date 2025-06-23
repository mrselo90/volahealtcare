import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

// GET /api/admin/testimonials/[id] - Get single testimonial
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            title: true,
            slug: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        translations: true
      }
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/testimonials/[id] - Update testimonial
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const {
      name,
      serviceId,
      rating,
      review,
      country,
      photoUrl,
      isApproved,
      isFeatured,
      translations
    } = data;

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Update testimonial
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (rating !== undefined) updateData.rating = rating;
    if (review !== undefined) updateData.review = review;
    if (country !== undefined) updateData.country = country;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: updateData,
      include: {
        service: {
          select: {
            title: true,
            slug: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        translations: true
      }
    });

    // Handle translations if provided
    if (translations && Array.isArray(translations)) {
      // Delete existing translations
      await prisma.testimonialTranslation.deleteMany({
        where: { testimonialId: params.id }
      });

      // Create new translations
      if (translations.length > 0) {
        await prisma.testimonialTranslation.createMany({
          data: translations.map((t: any) => ({
            testimonialId: params.id,
            language: t.language,
            review: t.review
          }))
        });
      }
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/testimonials/[id] - Delete testimonial
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete testimonial and its translations (cascade)
    await prisma.testimonial.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
} 