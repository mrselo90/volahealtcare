import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const appointment = await prisma.appointment.create({
      data,
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 