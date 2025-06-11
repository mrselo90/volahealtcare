import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  slug: string;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const images = await prisma.image.findMany({
      where: { serviceId: params.slug },
    });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Placeholder for image upload logic
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
} 