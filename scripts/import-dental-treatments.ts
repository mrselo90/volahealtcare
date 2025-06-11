import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

// Interface for CSV row data - accounting for possible BOM character in field names
interface TreatmentRow {
  [key: string]: string; // Allow any string key for flexibility with BOM characters
  // These are the expected fields, but they might have BOM characters
  // Title: string;
  // 'Metin 1': string; // Short title
  // 'Metin 2': string; // Short description
  // 'Görüntü 1': string; // Image URL
  // 'Metin 3': string; // Long description
  // ID: string;
  // 'Created Date': string;
  // 'Updated Date': string;
  // Owner: string;
  // 'Dental Treatment Details Kopyası': string;
  // 'Dental Detail ': string;
}

async function importDentalTreatments() {
  try {
    console.log('Starting to import dental treatments...');
    
    // First, let's check if we already have services in the database
    const existingCount = await prisma.service.count();
    console.log(`Found ${existingCount} existing services in the database`);
    
    const results: TreatmentRow[] = [];
    const csvFilePath = path.resolve(__dirname, '../Dental+Treatments+Detail-02.06.2025.csv');
    console.log(`Reading CSV file from: ${csvFilePath}`);
    
    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found at path: ${csvFilePath}`);
      return;
    }
    
    // Read and parse the CSV file
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser({ separator: ',' }))
        .on('data', (data: TreatmentRow) => {
          console.log(`Read row: ${data['Metin 1']}`);
          results.push(data);
        })
        .on('end', () => {
          console.log(`Read ${results.length} treatments from CSV file`);
          resolve();
        })
        .on('error', (error: Error) => {
          console.error(`Error reading CSV: ${error.message}`);
          reject(error);
        });
    });

    console.log(`Processing ${results.length} treatments...`);
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    // Process each treatment
    for (const row of results) {
      try {
        // Find the title fields regardless of BOM character
        const titleField = Object.keys(row).find(key => key.endsWith('Title') || key === 'Title');
        const metin1Field = Object.keys(row).find(key => key.endsWith('Metin 1') || key === 'Metin 1');
        const metin2Field = Object.keys(row).find(key => key.endsWith('Metin 2') || key === 'Metin 2');
        const metin3Field = Object.keys(row).find(key => key.endsWith('Metin 3') || key === 'Metin 3');
        const imageField = Object.keys(row).find(key => key.endsWith('G\u00f6r\u00fcnt\fc 1') || key === 'G\u00f6r\u00fcnt\fc 1' || key.includes('rüntü'));
        
        console.log(`Found fields: Title=${titleField}, Metin1=${metin1Field}, Metin2=${metin2Field}, Metin3=${metin3Field}, Image=${imageField}`);
        
        // Skip empty rows
        if (!metin1Field || !row[metin1Field]) {
          console.log(`Skipping row with empty title: ${JSON.stringify(row)}`);
          skipCount++;
          continue;
        }

        console.log(`
--- Processing treatment: ${row[metin1Field!]} ---`);
        
        // Generate a slug from the title
        const slug = row[metin1Field!]
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        console.log(`Generated slug: ${slug}`);

        // Extract benefits from the long description
        const benefits = metin3Field && row[metin3Field] && row[metin3Field].includes('Benefits:') ? 
          row[metin3Field].split('Benefits:')[1].split('\n\n')[0].trim() : '';
        console.log(`Extracted benefits: ${benefits.substring(0, 50)}${benefits.length > 50 ? '...' : ''}`);

        // Check if service already exists
        const existingService = await prisma.service.findUnique({
          where: { slug }
        });

        if (existingService) {
          console.log(`Service with slug '${slug}' already exists, skipping...`);
          skipCount++;
          continue;
        }

        // Determine the category based on the title or content
        let category = 'cosmetic'; // Default to cosmetic
        
        // Check if it's a dental treatment
        const dentalKeywords = ['dental', 'teeth', 'tooth', 'gum', 'smile', 'whitening', 'veneers', 'implant', 'crown', 'bridge'];
        const titleLower = row[metin1Field!].toLowerCase();
        const descLower = metin2Field ? row[metin2Field].toLowerCase() : '';
        
        if (dentalKeywords.some(keyword => titleLower.includes(keyword) || descLower.includes(keyword))) {
          category = 'dental';
        }
        
        console.log(`Categorizing '${row[metin1Field!]}' as '${category}'`);
        
        try {
          // Create the service
          console.log(`Creating service with title: ${row[metin1Field!]}`);
          const createdService = await prisma.service.create({
            data: {
              title: row[metin1Field!],
              slug,
              description: metin2Field ? row[metin2Field] : '',
              category, // Use the determined category
              price: category === 'dental' ? 500 : 2000, // Different default prices based on category
              duration: category === 'dental' ? '1-2 hours' : '2-4 hours', // Different default durations
              benefits,
              translations: {
                create: {
                  language: 'en',
                  title: row[metin1Field!],
                  description: metin3Field ? row[metin3Field] : '',
                },
              },
              images: {
                create: {
                  url: '/images/placeholder.svg',
                  alt: `${row[metin1Field!]} - Featured Image`,
                  type: 'featured',
                },
              },
            },
          });

          console.log(`Successfully created service: ${createdService.title} (${createdService.id})`);
          successCount++;
        } catch (serviceError: any) {
          console.error(`Error creating service ${row['Metin 1']}: ${serviceError.message}`);
          errorCount++;
        }
      } catch (rowError: any) {
        console.error(`Error processing row: ${rowError.message}`);
        errorCount++;
      }
    }

    console.log(`
Import summary:
- Total rows: ${results.length}
- Successfully imported: ${successCount}
- Skipped: ${skipCount}
- Errors: ${errorCount}`);
    console.log('Finished importing treatments!');
  } catch (error) {
    console.error('Error in main import process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importDentalTreatments();
