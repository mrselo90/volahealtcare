import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all categories with image URLs
    const categories = await prisma.category.findMany({
      where: {
        imageUrl: { not: null }
      }
    });

    const updates = [];
    const uploadsDir = path.join(process.cwd(), 'public/uploads/categories');
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (const category of categories) {
      if (category.imageUrl) {
        const imagePath = path.join(process.cwd(), 'public', category.imageUrl);
        
        // Check if the file exists
        if (!fs.existsSync(imagePath)) {
          // Update the category to remove the image URL
          updates.push(
            prisma.category.update({
              where: { id: category.id },
              data: { imageUrl: null }
            })
          );
        }
      }
    }

    // Execute all updates
    const results = await Promise.all(updates);

    return NextResponse.json({
      message: 'Cleanup completed',
      updatedCategories: results.length
    });

  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json(
      { error: 'Failed to perform cleanup' },
      { status: 500 }
    );
  }
}
