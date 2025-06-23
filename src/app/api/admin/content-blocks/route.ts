import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || 
        (session.user.email !== 'admin@volahealthistanbul.com' && 
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentBlocks = await prisma.contentBlock.findMany({
      orderBy: { orderIndex: 'asc' }
    });

    return NextResponse.json(contentBlocks);
  } catch (error) {
    console.error('Error fetching content blocks:', error);
    return NextResponse.json({ error: 'Failed to fetch content blocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || 
        (session.user.email !== 'admin@volahealthistanbul.com' && 
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const contentBlock = await prisma.contentBlock.create({
      data: {
        key: data.key,
        title: data.title,
        content: data.content || null,
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || 'image',
        mediaAlt: data.mediaAlt || null,
        isActive: data.isActive ?? true,
        orderIndex: data.orderIndex || 0,
      }
    });

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error('Error creating content block:', error);
    return NextResponse.json({ error: 'Failed to create content block' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || 
        (session.user.email !== 'admin@volahealthistanbul.com' && 
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Content block ID is required' }, { status: 400 });
    }

    const contentBlock = await prisma.contentBlock.update({
      where: { id: data.id },
      data: {
        key: data.key,
        title: data.title,
        content: data.content || null,
        mediaUrl: data.mediaUrl || null,
        mediaType: data.mediaType || 'image',
        mediaAlt: data.mediaAlt || null,
        isActive: data.isActive ?? true,
        orderIndex: data.orderIndex || 0,
      }
    });

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error('Error updating content block:', error);
    return NextResponse.json({ error: 'Failed to update content block' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || 
        (session.user.email !== 'admin@volahealthistanbul.com' && 
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Content block ID is required' }, { status: 400 });
    }

    await prisma.contentBlock.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Content block deleted successfully' });
  } catch (error) {
    console.error('Error deleting content block:', error);
    return NextResponse.json({ error: 'Failed to delete content block' }, { status: 500 });
  }
} 