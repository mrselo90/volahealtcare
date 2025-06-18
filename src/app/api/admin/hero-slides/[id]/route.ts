import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PUT - Update hero slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      title, 
      subtitle, 
      category, 
      imageUrl, 
      videoUrl,
      mediaType,
      videoPoster,
      orderIndex, 
      isActive, 
      translations 
    } = body;

    // Update the slide
    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: {
        title,
        subtitle,
        category,
        imageUrl,
        videoUrl,
        mediaType,
        videoPoster,
        orderIndex,
        isActive
      }
    });

    // Update translations if provided
    if (translations && translations.length > 0) {
      // Delete existing translations
      await prisma.heroSlideTranslation.deleteMany({
        where: { slideId: params.id }
      });

      // Create new translations
      await prisma.heroSlideTranslation.createMany({
        data: translations.map((t: any) => ({
          slideId: params.id,
          language: t.language,
          title: t.title,
          subtitle: t.subtitle,
          category: t.category
        }))
      });
    }

    // Fetch updated slide with translations
    const updatedSlide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
      include: {
        translations: true
      }
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.heroSlide.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
} 