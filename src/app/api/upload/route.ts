import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueId = uuidv4();
      const extension = file.name.split('.').pop();
      const filename = `${uniqueId}.${extension}`;

      // Save to public/uploads directory
      const path = join(process.cwd(), 'public/uploads', filename);
      await writeFile(path, buffer);

      // Return the public URL
      return `/uploads/${filename}`;
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Failed to upload files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
} 