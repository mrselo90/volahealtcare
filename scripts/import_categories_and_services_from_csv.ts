import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import slugify from 'slugify';

const prisma = new PrismaClient();

const csvPath = path.join(__dirname, '../Dental+Treatments+Detail-02.06.2025.csv');

const MAIN_CATEGORIES = [
  { name: 'Dental', slug: 'dental', orderIndex: 0 },
  { name: 'Body', slug: 'body', orderIndex: 1 },
  { name: 'Face', slug: 'face', orderIndex: 2 },
];

async function main() {
  // 0. Delete all existing services and categories
  await prisma.image.deleteMany();
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();

  // 1. Create main categories if not exist
  for (const cat of MAIN_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        orderIndex: cat.orderIndex,
      },
    });
  }

  // 2. Parse CSV
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true, bom: true, quote: '"' });

  // 3. Assign each service to a category
  for (const row of records) {
    // Heuristic: Use the 'Dental Treatment Details Kopyası' or 'Dental Detail ' column to determine category
    let categorySlug = 'dental'; // default
    const pathCol = row['Dental Treatment Details Kopyası'] || row['Dental Detail '];
    if (typeof pathCol === 'string') {
      const lower = pathCol.toLowerCase();
      if (lower.includes('face')) categorySlug = 'face';
      else if (lower.includes('body') || lower.includes('bbl') || lower.includes('tummy') || lower.includes('liposuction') || lower.includes('breast') || lower.includes('thigh') || lower.includes('arm')) categorySlug = 'body';
      else categorySlug = 'dental';
    }
    // Fallback: Use title keywords if needed
    if (!categorySlug && row['Title']) {
      const t = row['Title'].toLowerCase();
      if (t.includes('face') || t.includes('rhinoplasty') || t.includes('eyelid') || t.includes('botox') || t.includes('brow') || t.includes('neck') || t.includes('jaw')) categorySlug = 'face';
      else if (t.includes('bbl') || t.includes('tummy') || t.includes('liposuction') || t.includes('breast') || t.includes('thigh') || t.includes('arm')) categorySlug = 'body';
      else categorySlug = 'dental';
    }
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      console.error(`Category not found for slug: ${categorySlug}`);
      continue;
    }

    // Prepare service data
    const title = row['Title']?.trim();
    const slug = slugify(title || '', { lower: true, strict: true });
    const shortDescription = row['Metin 2']?.trim();
    const longDescription = row['Metin 3']?.trim();
    const imageUrl = row['Görüntü 1']?.trim();
    let description = shortDescription || '';
    if (longDescription) {
      description += '\n\n' + longDescription;
    }

    // Create service
    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        categoryId: category.id,
        price: 0,
        duration: 'N/A',
        currency: 'USD',
      },
    });

    // Add image if valid
    if (imageUrl && imageUrl !== '' && imageUrl !== 'null') {
      await prisma.image.create({
        data: {
          url: imageUrl,
          alt: title,
          type: 'gallery',
          serviceId: service.id,
        },
      });
    }
  }

  console.log('Categories and services imported successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 