import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 