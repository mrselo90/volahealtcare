import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE request received for message ID:', params.id);
    
    const session = await getServerSession();
    console.log('Session:', session?.user?.email);
    
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    console.log('Attempting to delete message with ID:', id);

    // Check if message exists
    const message = await prisma.chatMessage.findUnique({
      where: { id }
    });
    console.log('Message found:', !!message);

    if (!message) {
      console.log('Message not found in database');
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Delete the message
    await prisma.chatMessage.delete({
      where: { id }
    });
    console.log('Message deleted successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

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

    const { id } = params;
    const { isRead } = await request.json();

    // Update the message
    const updatedMessage = await prisma.chatMessage.update({
      where: { id },
      data: { isRead }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
} 