import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isValidLanguage } from '@/lib/i18n/config';

export async function GET(
  request: Request,
  { params }: { params: { lang: string } }
) {
  try {
    const lang = params.lang;

    if (!isValidLanguage(lang)) {
      return NextResponse.json(
        { error: 'Invalid language code' },
        { status: 400 }
      );
    }

    // Fetch all translations for the specified language
    const translations = await prisma.translation.findMany({
      where: {
        languageCode: lang,
      },
      select: {
        key: true,
        value: true,
      },
    });

    // Convert to key-value object
    const translationMap = translations.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(translationMap);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
} 