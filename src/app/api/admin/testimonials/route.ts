import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all testimonials
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      serviceTitle,
      rating,
      review,
      country,
      photoUrl,
      isApproved = false,
      isFeatured = false,
      userId,
      userName,
      userEmail
    } = body;

    // Validate required fields
    if ((!serviceId && !serviceTitle) || !rating || !review || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    let finalServiceId = serviceId;
    let finalUserId = userId;

    // Handle service creation/finding
    if (!serviceId && serviceTitle) {
      // Try to find existing service by title
      let service = await prisma.service.findFirst({
        where: { title: serviceTitle }
      });

      // If not found, create new service
      if (!service) {
        // First, we need to find or create a category
        let category = await prisma.category.findFirst({
          where: { slug: 'general' }
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: JSON.stringify({ en: 'General', tr: 'Genel' }),
              slug: 'general',
              orderIndex: 999
            }
          });
        }

        service = await prisma.service.create({
          data: {
            title: serviceTitle,
            slug: serviceTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: `Service for ${serviceTitle}`,
            price: 0,
            categoryId: category.id,
            operationTime: '1-2 hours'
          }
        });
      }
      finalServiceId = service.id;
    }

    // Handle user creation/finding
    if (!userId && userName) {
      // Try to find existing user by name first
      let user = await prisma.user.findFirst({
        where: { name: userName }
      });

      // If not found, create new user with temporary email
      if (!user) {
        const tempEmail = `${userName.toLowerCase().replace(/\s+/g, '.')}@testimonial.temp`;
        user = await prisma.user.create({
          data: {
            name: userName,
            email: tempEmail,
            role: 'USER'
          }
        });
      }
      finalUserId = user.id;
    }

    // Check if service exists
    if (finalServiceId) {
      const service = await prisma.service.findUnique({
        where: { id: finalServiceId }
      });

      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' },
          { status: 404 }
        );
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        serviceId: finalServiceId,
        rating,
        review,
        country,
        photoUrl: photoUrl || null,
        isApproved,
        isFeatured,
        userId: finalUserId || null
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

// PUT - Update testimonial
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      serviceId,
      rating,
      review,
      country,
      photoUrl,
      isApproved,
      isFeatured
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(serviceId && { serviceId }),
        ...(rating && { rating }),
        ...(review && { review }),
        ...(country && { country }),
        ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
        ...(isApproved !== undefined && { isApproved }),
        ...(isFeatured !== undefined && { isFeatured })
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE - Delete testimonial
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({
      where: { id }
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