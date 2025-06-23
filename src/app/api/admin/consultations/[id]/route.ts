import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
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

    const { status, notes } = await request.json();
    const { id } = params;

    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: {
        status,
        notes,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedConsultation);
  } catch (error) {
    console.error('Error updating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
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

    const { id } = params;

    const consultation = await prisma.consultation.findUnique({
      where: { id }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(consultation);
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    );
  }
} 