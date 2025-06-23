import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const updates = [];
    for (const key of SOCIAL_MEDIA_KEYS) {
      if (data[key] !== undefined) {
        updates.push(
          prisma.siteConfig.upsert({
            where: { key },
            update: { value: data[key] },
            create: {
              key,
              value: data[key],
              description: `Social media URL for ${key.replace('social_', '')}`
            }
          })
        );
      }
    }

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update social media settings:', error);
    return NextResponse.json(
      { error: 'Failed to update social media settings' },
      { status: 500 }
    );
  }
} 