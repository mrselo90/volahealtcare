import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    const data = await request.formData();
    const file = data.get('file') as File;

    console.log('File received:', file ? file.name : 'No file');

    if (!file) {
      console.log('Error: No file received');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
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
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.log('Error: File too large:', file.size);
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name) || '.jpg';
    const filename = `${timestamp}-${randomId}${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);
    console.log('File saved successfully:', filename);

    // Return the public URL
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 