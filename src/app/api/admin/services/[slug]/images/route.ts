import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

interface RouteParams {
  slug: string;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // First find the service by slug to get the serviceId
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const images = await prisma.image.findMany({
      where: { serviceId: service.id },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    console.log('Service image upload request received for slug:', params.slug);
    
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Error: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Admin authenticated:', session.user.email);

    // First find the service by slug to get the serviceId
    const service = await prisma.service.findUnique({
      where: { slug: params.slug },
    });

    if (!service) {
      console.log('Error: Service not found for slug:', params.slug);
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const alt = formData.get('alt') as string;

    console.log('Form data received:', {
      file: file ? file.name : 'No file',
      type: type || 'No type',
      alt: alt || 'No alt'
    });

    if (!file) {
      console.log('Error: No file received');
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Error: Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.log('Error: File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create directory for the service if it doesn't exist
    const serviceDir = join(process.cwd(), 'public', 'uploads', 'services', params.slug);
    try {
      await mkdir(serviceDir, { recursive: true });
      console.log('Service directory created/verified:', serviceDir);
    } catch (error) {
      console.error('Error creating directory:', error);
      return NextResponse.json(
        { error: 'Failed to create directory for upload' },
        { status: 500 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = join(serviceDir, fileName);

    // Convert file to buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    console.log('File saved successfully:', fileName);

    // Return the URL path to the uploaded file
    const imageUrl = `/uploads/services/${params.slug}/${fileName}`;

    // Create image record in database
    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        alt: alt || null,
        type: type || 'gallery',
        serviceId: service.id,
      },
    });

    console.log('Image record created in database:', image.id);

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 