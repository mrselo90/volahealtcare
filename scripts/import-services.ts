import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

const csvFilePath = path.join(__dirname, '../Dental+Treatments+Detail.csv');

// Function to sanitize slug
const sanitizeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Function to generate placeholder image filename
const getImageFilename = (title: string): string => {
  const slug = sanitizeSlug(title);
  return `/images/services/${slug}.svg`;
};

// Function to determine category based on title or description
const determineCategory = (title: string, description: string): string => {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();

  if (
    lowerTitle.includes('dental') ||
    lowerTitle.includes('teeth') ||
    lowerTitle.includes('smile') ||
    lowerTitle.includes('gum') ||
    lowerTitle.includes('implant') ||
    lowerTitle.includes('crown') ||
    lowerTitle.includes('root')
  ) {
    return 'Dental Aesthetics';
  }

  if (
    lowerTitle.includes('face') ||
    lowerTitle.includes('nose') ||
    lowerTitle.includes('eye') ||
    lowerTitle.includes('brow') ||
    lowerTitle.includes('botox') ||
    lowerTitle.includes('lift') ||
    lowerDesc.includes('facial')
  ) {
    return 'Facial Aesthetics';
  }

  return 'Body Aesthetics';
};

async function importServices() {
  const csvContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  parse(
    csvContent,
    {
      columns: true,
      delimiter: ',',
      trim: true,
      skip_empty_lines: true,
      relax_quotes: true,
      bom: true,
    },
    async (err, records) => {
      if (err) {
        console.error('Error parsing CSV:', err);
        return;
      }

      for (const row of records) {
        try {
          const title = row.Title;
          if (!title) continue;

          const description = row['Metin 1'] || '';
          const longDescription = row['Metin 3'] || '';
          const category = determineCategory(title, description);
          const slug = sanitizeSlug(title);
          const imageUrl = getImageFilename(title);

          // Create or update the service
          const service = await prisma.service.upsert({
            where: { slug },
            create: {
              title,
              slug,
              description,
              category,
              translations: {
                create: [
                  {
                    language: 'en',
                    title,
                    description,
                    slug,
                  },
                ],
              },
              images: {
                create: [
                  {
                    url: imageUrl,
                    alt: title,
                  },
                ],
              },
            },
            update: {
              title,
              description,
              category,
              translations: {
                upsert: {
                  where: {
                    serviceId_language: {
                      serviceId: '', // Will be filled in the next step
                      language: 'en',
                    },
                  },
                  create: {
                    language: 'en',
                    title,
                    description,
                    slug,
                  },
                  update: {
                    title,
                    description,
                  },
                },
              },
            },
            include: {
              translations: true,
            },
          });

          console.log(`Imported service: ${title}`);
        } catch (error) {
          console.error(`Error importing service ${row.Title}:`, error);
        }
      }

      console.log('Finished importing all services');
      await prisma.$disconnect();
    }
  );
}

importServices().catch(console.error); 