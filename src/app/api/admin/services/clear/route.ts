import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rm } from 'fs/promises';
import { join } from 'path';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all services and their related data
    await prisma.$transaction([
      prisma.serviceImage.deleteMany(),
      prisma.serviceFAQ.deleteMany(),
      prisma.beforeAfterImage.deleteMany(),
      prisma.serviceTranslation.deleteMany(),
      prisma.service.deleteMany(),
    ]);

    // Delete the uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'services');
    try {
      await rm(uploadsDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting uploads directory:', error);
    }

    return NextResponse.json({ message: 'All services and related data cleared successfully' });
  } catch (error) {
    console.error('Error clearing services:', error);
    return NextResponse.json(
      { error: 'Failed to clear services' },
      { status: 500 }
    );
  }
} 