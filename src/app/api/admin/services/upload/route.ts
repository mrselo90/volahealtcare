import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;

    if (!file || !slug) {
      return NextResponse.json(
        { error: 'File and slug are required' },
        { status: 400 }
      );
    }

    // Create directory for the service if it doesn't exist
    const serviceDir = join(process.cwd(), 'public', 'uploads', 'services', slug);
    try {
      await mkdir(serviceDir, { recursive: true });
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

async function createDirIfNotExists(dir: string) {
  try {
    await writeFile(join(dir, '.gitkeep'), '');
  } catch (error) {
    // Directory might already exist, which is fine
  }
} 