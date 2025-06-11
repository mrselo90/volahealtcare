import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const consultation = await prisma.consultation.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        age: data.age,
        gender: data.gender,
        interestedServices: data.interestedServices,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime,
        medicalHistory: data.medicalHistory,
        currentMedications: data.currentMedications,
        budget: data.budget,
        additionalInfo: data.additionalInfo,
        contactMethod: data.contactMethod,
        status: 'pending'
      }
    });

    return NextResponse.json(consultation, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    );
  }
} 