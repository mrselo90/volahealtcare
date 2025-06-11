import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
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
    
    // Validate required fields
    if (!data.sessionId || !data.content) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create a new chat message from admin
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: data.sessionId,
        content: data.content,
        type: 'admin',
        isRead: true,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to create message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 