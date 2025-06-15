import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch approved testimonials for public display
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true,
            categoryId: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Transform data to match frontend expectations
    const transformedTestimonials = testimonials.map(testimonial => ({
      id: testimonial.id,
      content: testimonial.review,
      author: testimonial.user?.name || 'Anonymous Patient',
      role: `${testimonial.service.title} Patient`,
      rating: testimonial.rating,
      country: testimonial.country,
      date: testimonial.createdAt.toISOString().split('T')[0],
      procedure: testimonial.service.title,
      videoUrl: testimonial.videoUrl,
      treatment: getServiceCategory(testimonial.service.categoryId),
      beforeAfter: true,
      isFeatured: testimonial.isFeatured
    }));

    return NextResponse.json(transformedTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// Helper function to map category IDs to treatment types
function getServiceCategory(categoryId: string): string {
  // This is a simplified mapping - you might want to fetch actual category data
  const categoryMap: { [key: string]: string } = {
    'dental': 'dental',
    'hair': 'hair-transplant',
    'aesthetic': 'facial',
    'body': 'body'
  };
  
  return categoryMap[categoryId] || 'other';
} 