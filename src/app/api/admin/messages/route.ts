import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
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
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
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

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const sessionId = searchParams.get('sessionId');

    if (type === 'bot-messages') {
      // Delete only bot messages to reduce clutter
      const deletedMessages = await prisma.chatMessage.deleteMany({
        where: {
          type: 'bot'
        }
      });
      return NextResponse.json({ 
        message: `Deleted ${deletedMessages.count} bot messages`,
        count: deletedMessages.count 
      });
    } else if (type === 'session' && sessionId) {
      // Delete all messages from a specific session
      const deletedMessages = await prisma.chatMessage.deleteMany({
        where: {
          sessionId: sessionId
        }
      });
      return NextResponse.json({ 
        message: `Deleted ${deletedMessages.count} messages from session`,
        count: deletedMessages.count 
      });
    } else if (type === 'old-messages') {
      // Delete messages older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const deletedMessages = await prisma.chatMessage.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      });
      return NextResponse.json({ 
        message: `Deleted ${deletedMessages.count} old messages`,
        count: deletedMessages.count 
      });
    } else {
      return new NextResponse('Invalid delete type', { status: 400 });
    }
  } catch (error) {
    console.error('Failed to delete messages:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 