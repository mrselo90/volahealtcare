import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

const csvPath = path.join(process.cwd(), 'Dental+Treatments+Detail-02.06.2025.csv');

interface CsvRow {
  Title: string;
  'Metin 1': string;
  'Metin 2': string;
  'Görüntü 1': string;
  'Metin 3': string;
  ID: string;
  'Dental Treatment Details Kopyası': string;
  'Dental Detail ': string;
}

async function main() {
  const services: CsvRow[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.Title && row['Metin 1']) {
          services.push(row);
        }
      })
      .on('end', resolve)
      .on('error', reject);
  });

  for (const row of services) {
    const slug = row.Title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    const description = [row['Metin 1'], row['Metin 2'], row['Metin 3'], row['Dental Detail '], row['Dental Treatment Details Kopyası']]
  .filter(Boolean)
  .map(t => t.trim())
  .filter(Boolean)
  .join('\n\n');
    const imageUrl = row['Görüntü 1'] || '';
    // Try to upsert (update if exists, else create)
    await prisma.service.upsert({
      where: { slug },
      update: {
        title: row.Title,
        description,
        images: {
          deleteMany: {},
          create: imageUrl ? [{ url: imageUrl, alt: row.Title }] : [],
        },
      },
      create: {
        title: row.Title,
        slug,
        description,
        category: 'Dental',
        price: 0,
        duration: '',
        currency: 'USD',
        featured: false,
        translations: {
          create: [
            {
              language: 'en',
              title: row.Title,
              description,
            },
          ],
        },
        images: {
          create: imageUrl ? [{ url: imageUrl, alt: row.Title }] : [],
        },
      },
      include: { images: true, translations: true },
    });
    console.log(`Upserted: ${row.Title}`);
  }
  console.log('Sync complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
