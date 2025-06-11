import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure upload directory exists
const uploadDir = join(process.cwd(), 'public', 'uploads');
const ensureUploadDir = async () => {
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
};

// Initialize upload directory
ensureUploadDir();

type ImageType = 'gallery' | 'before-after' | 'featured';

interface ImageData {
  url: string;
  alt: string | null;
  type: ImageType;
  serviceId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as ImageType | null;
    let alt = formData.get('alt') as string | null;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);
    const relativePath = `/uploads/${fileName}`;

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create image record in database with type assertion
    const imageData: ImageData = {
      url: relativePath,
      alt: alt || null,
      type,
      serviceId: params.serviceId,
    };

    const image = await prisma.image.create({
      data: imageData as any, // Using any to bypass type checking
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const images = await prisma.image.findMany({
      where: { serviceId: params.serviceId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
