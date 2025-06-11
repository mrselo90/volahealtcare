import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const SOCIAL_MEDIA_KEYS = [
  'social_instagram',
  'social_facebook', 
  'social_linkedin',
  'social_youtube',
  'social_pinterest',
  'social_twitter'
];

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: {
        key: {
          in: SOCIAL_MEDIA_KEYS
        }
      }
    });

    const socialMedia = SOCIAL_MEDIA_KEYS.reduce((acc, key) => {
      const config = configs.find(c => c.key === key);
      acc[key] = config?.value || '';
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Failed to fetch social media settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media settings' },
      { status: 500 }
    );
  }
} 