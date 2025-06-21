export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    console.log('Admin upload request received');
    
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Error: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Admin authenticated:', session.user.email);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    console.log('Form data received:', {
      file: file ? file.name : 'No file',
      slug: slug || 'No slug'
    });

    if (!file || !slug) {
      console.log('Error: Missing required fields - file:', !!file, 'slug:', !!slug);
      return NextResponse.json(
        { error: 'File and slug are required' },
        { status: 400 }
      );
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
    const serviceDir = join(process.cwd(), 'public', 'uploads', 'services', slug);
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
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(serviceDir, fileName);

    // Convert file to buffer and save it
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    console.log('File saved successfully:', fileName);

    // Return the URL path to the uploaded file
    const imageUrl = `/uploads/services/${slug}/${fileName}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Delete image
export async function DELETE(request: Request) {
  try {
    console.log('Admin delete image request received');
    
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Error: Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract the file path from the URL
    // URL format: /uploads/services/slug/filename.ext
    const urlPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    const filePath = join(process.cwd(), 'public', urlPath);

    // Check if file exists and delete it
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log('File deleted successfully:', filePath);
    } else {
      console.log('File not found:', filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(join(dir, '.gitkeep'), '');
  } catch (error) {
    // Directory might already exist, which is fine
  }
} 