import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Ücretsiz çeviri servisleri
const TRANSLATION_SERVICES = [
  {
    name: 'LibreTranslate',
    url: 'https://libretranslate.de/translate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: (text: string, targetLang: string) => ({
      q: text,
      source: 'en',
      target: targetLang,
      format: 'text'
    }),
    extractResponse: (data: any) => data.translatedText
  },
  {
    name: 'MyMemory',
    url: 'https://api.mymemory.translated.net/get',
    method: 'GET',
    headers: {},
    body: (text: string, targetLang: string) => ({
      q: text,
      langpair: `en|${targetLang}`
    }),
    extractResponse: (data: any) => data.responseData.translatedText
  }
];

// Dil kodları eşleştirmesi
const LANGUAGE_CODES: { [key: string]: string } = {
  'tr': 'tr',
  'ar': 'ar',
  'de': 'de',
  'es': 'es',
  'fr': 'fr',
  'it': 'it',
  'nl': 'nl',
  'pl': 'pl',
  'pt': 'pt',
  'ru': 'ru',
  'zh': 'zh'
};

async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') return '';
  
  for (const service of TRANSLATION_SERVICES) {
    try {
      console.log(`Trying ${service.name} for ${targetLang}...`);
      
      const response = await axios({
        method: service.method,
        url: service.url,
        headers: service.headers,
        [service.method === 'GET' ? 'params' : 'data']: service.body(text, targetLang),
        timeout: 10000
      });
      
      const translatedText = service.extractResponse(response.data);
      
      if (translatedText && translatedText !== text) {
        console.log(`✓ ${service.name} success for ${targetLang}`);
        return translatedText;
      }
    } catch (error) {
      console.log(`✗ ${service.name} failed for ${targetLang}:`, (error as Error).message);
    }
  }
  
  console.log(`✗ All services failed for ${targetLang}, keeping original text`);
  return text;
}

async function translateService(service: any) {
  console.log(`\n=== Translating service: ${service.slug} ===`);
  
  const englishTranslation = service.translations.find((t: any) => t.language === 'en');
  if (!englishTranslation) {
    console.log('No English translation found, skipping...');
    return;
  }
  
  const { title, description, content } = englishTranslation;
  
  // Her dil için çeviri yap
  for (const translation of service.translations) {
    if (translation.language === 'en') continue;
    
    const langCode = LANGUAGE_CODES[translation.language];
    if (!langCode) {
      console.log(`Skipping ${translation.language} - no language code mapping`);
      continue;
    }
    
    console.log(`\nTranslating to ${translation.language}...`);
    
    // Title çevirisi
    if (title && (!translation.title || translation.title === title)) {
      translation.title = await translateText(title, langCode);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }
    
    // Description çevirisi
    if (description && (!translation.description || translation.description === description)) {
      translation.description = await translateText(description, langCode);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Content çevirisi (uzun metin için parçalara böl)
    if (content && (!translation.content || translation.content === content)) {
      const paragraphs = content.split('\n\n').filter((p: string) => p.trim());
      const translatedParagraphs = [];
      
      for (const paragraph of paragraphs) {
        const translated = await translateText(paragraph, langCode);
        translatedParagraphs.push(translated);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Daha uzun bekleme
      }
      
      translation.content = translatedParagraphs.join('\n\n');
    }
  }
  
  // Veritabanını güncelle
  try {
    await prisma.service.update({
      where: { id: service.id },
      data: {
        translations: {
          deleteMany: {},
          create: service.translations.map((t: any) => ({
            language: t.language,
            title: t.title,
            description: t.description,
            content: t.content
          }))
        }
      }
    });
    
    console.log(`✓ Service ${service.slug} updated successfully`);
  } catch (error) {
    console.error(`✗ Error updating service ${service.slug}:`, error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting service translation...');
    
    // Tüm servisleri al
    const services = await prisma.service.findMany({
      include: {
        translations: true
      }
    });
    
    console.log(`Found ${services.length} services to translate`);
    
    // Her servis için çeviri yap
    for (const service of services) {
      await translateService(service);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Servisler arası bekleme
    }
    
    console.log('\n🎉 Translation completed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Script'i çalıştır
if (require.main === module) {
  main();
} 