import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cases = await prisma.beforeAfterCase.findMany({
      include: {
        category: true,
        service: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Failed to fetch before/after cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch before/after cases' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const beforeAfterCase = await prisma.beforeAfterCase.create({
      data: {
        title: data.title,
        patientAge: data.patientAge ? parseInt(data.patientAge) : null,
        patientGender: data.patientGender || null,
        patientCountry: data.patientCountry || null,
        beforeImage: data.beforeImage,
        afterImage: data.afterImage,
        description: data.description || null,
        treatmentDetails: data.treatmentDetails || null,
        results: data.results || null,
        timeframe: data.timeframe || null,
        categoryId: data.categoryId || null,
        serviceId: data.serviceId || null,
        isFeatured: data.isFeatured || false,
        isPublished: data.isPublished !== false, // default to true
        sortOrder: data.sortOrder || 0,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        beforeImageAlt: data.beforeImageAlt || null,
        afterImageAlt: data.afterImageAlt || null,
      },
      include: {
        category: true,
        service: true,
      },
    });
    
    return NextResponse.json(beforeAfterCase);
  } catch (error) {
    console.error('Failed to create before/after case:', error);
    return NextResponse.json(
      { error: 'Failed to create before/after case', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updateData } = data;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }
    
    const beforeAfterCase = await prisma.beforeAfterCase.update({
      where: { id },
      data: {
        title: updateData.title,
        patientAge: updateData.patientAge ? parseInt(updateData.patientAge) : null,
        patientGender: updateData.patientGender || null,
        patientCountry: updateData.patientCountry || null,
        beforeImage: updateData.beforeImage,
        afterImage: updateData.afterImage,
        description: updateData.description || null,
        treatmentDetails: updateData.treatmentDetails || null,
        results: updateData.results || null,
        timeframe: updateData.timeframe || null,
        categoryId: updateData.categoryId || null,
        serviceId: updateData.serviceId || null,
        isFeatured: updateData.isFeatured || false,
        isPublished: updateData.isPublished !== false,
        sortOrder: updateData.sortOrder || 0,
        tags: updateData.tags ? JSON.stringify(updateData.tags) : null,
        beforeImageAlt: updateData.beforeImageAlt || null,
        afterImageAlt: updateData.afterImageAlt || null,
      },
      include: {
        category: true,
        service: true,
      },
    });
    
    return NextResponse.json(beforeAfterCase);
  } catch (error) {
    console.error('Failed to update before/after case:', error);
    return NextResponse.json(
      { error: 'Failed to update before/after case', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }

    await prisma.beforeAfterCase.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete before/after case:', error);
    return NextResponse.json(
      { error: 'Failed to delete before/after case' },
      { status: 500 }
    );
  }
} 