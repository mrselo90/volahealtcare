import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      rating,
      review,
      country,
      videoUrl,
      isApproved = false,
      isFeatured = false,
      userId
    } = body;

    // Validate required fields
    if (!serviceId || !rating || !review || !country) {
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

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        serviceId,
        rating,
        review,
        country,
        videoUrl: videoUrl || null,
        isApproved,
        isFeatured,
        userId: userId || null
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
      videoUrl,
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
        ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
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