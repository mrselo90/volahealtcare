import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.content || !data.sessionId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Create a new chat message
    const message = await prisma.chatMessage.create({
      data: {
        sessionId: data.sessionId,
        content: data.content,
        type: data.type || 'user',
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Failed to create chat message:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
