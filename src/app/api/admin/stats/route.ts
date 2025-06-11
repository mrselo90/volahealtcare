import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [services, appointments, messages, testimonials] = await Promise.all([
      prisma.service.count(),
      prisma.appointment.count(),
      prisma.chatMessage.count(),
      prisma.testimonial.count(),
    ]);

    return NextResponse.json({
      services,
      appointments,
      messages,
      testimonials,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 