import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { languages } from '@/lib/i18n/config';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { translations } = body;

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        { error: 'Invalid translations format' },
        { status: 400 }
      );
    }

    // Process each translation entry
    for (const entry of translations) {
      const { key, translations: values } = entry;

      // Validate the translation entry
      if (!key || typeof values !== 'object') {
        continue;
      }

      // Update or create translations for each language
      for (const lang of languages) {
        const value = values[lang.code];
        if (value === undefined) continue;

        await prisma.translation.upsert({
          where: {
            key_languageCode: {
              key,
              languageCode: lang.code,
            },
          },
          update: { value },
          create: {
            key,
            languageCode: lang.code,
            value,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing bulk translations:', error);
    return NextResponse.json(
      { error: 'Failed to process translations' },
      { status: 500 }
    );
  }
} 