import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [recentAppointments, recentTestimonials] = await Promise.all([
      prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),
      prisma.testimonial.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { service: true },
      }),
    ]);

    return NextResponse.json({
      recentAppointments,
      recentTestimonials,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
} 