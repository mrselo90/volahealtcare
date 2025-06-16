import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone, message, treatment, country } = data;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !message || !treatment) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create consultation request in database
    const consultation = await prisma.consultation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        notes: message,
        country: country || 'Not specified',
        interestedServices: treatment || 'Not specified',
        status: 'PENDING',
      },
    });

    return NextResponse.json(
      { message: 'Consultation request received successfully', consultation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to create consultation request' },
      { status: 500 }
    );
  }
} 