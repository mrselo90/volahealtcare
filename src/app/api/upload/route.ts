import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');
    const data = await request.formData();
    const file = data.get('file') as File;
    const type = data.get('type') as string;

    console.log('File received:', file ? file.name : 'No file');
    console.log('Upload type:', type);

    if (!file) {
      console.log('Error: No file received');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type based on upload type
    let allowedTypes: string[];
    let maxSize: number;
    let uploadDir: string;

    if (type === 'hero-video') {
      allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      maxSize = 50 * 1024 * 1024; // 50MB for videos
      uploadDir = 'videos';
    } else {
      // For general uploads (content blocks, etc.), allow both images and videos
      allowedTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
      ];
      maxSize = 50 * 1024 * 1024; // 50MB for both images and videos
      uploadDir = file.type.startsWith('video/') ? 'videos' : 'uploads';
    }

    if (!allowedTypes.includes(file.type)) {
      console.log('Error: Invalid file type:', file.type);
      const allowedExtensions = type === 'hero-video' ? 'MP4, WebM, MOV' : 'JPEG, PNG, WebP, MP4, WebM, MOV';
      return NextResponse.json({ 
        error: `Invalid file type. Only ${allowedExtensions} are allowed.` 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > maxSize) {
      console.log('Error: File too large:', file.size);
      const maxSizeMB = '50MB';
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSizeMB}.` 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsPath = path.join(process.cwd(), 'public', uploadDir);
    try {
      await mkdir(uploadsPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.name) || (type === 'hero-video' ? '.mp4' : '.jpg');
    const filename = `${timestamp}-${randomId}${extension}`;
    const filepath = path.join(uploadsPath, filename);

    // Write file to disk
    await writeFile(filepath, buffer);
    console.log('File saved successfully:', filename);

    // Return the public URL
    const url = `/${uploadDir}/${filename}`;
    
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