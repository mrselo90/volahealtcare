import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

const sourceDir = '/Users/sboyuk/Downloads/site files - 3259dbf8-b5f5-4c4b-8b45-77eb0bf339c6';
const outputDir = path.join(__dirname, '../public/images/services');
const csvFilePath = path.join(__dirname, '../Dental+Treatments+Detail-02.06.2025.csv');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to sanitize filename
const sanitizeFilename = (title: string): string => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Function to copy file
const copyFile = (source: string, destination: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, destination, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Image mapping for specific services
const imageMapping: { [key: string]: string[] } = {
  'bbl-detail': ['before-after'],
  'teeth-whitening-detail': ['dental-veneers', 'dental-crowns'],
  'facelift-surgery-detail': ['brow-lifting', 'forehead'],
  'hollywood-smile-detail': ['dental-veneers', 'dental-crowns', 'dsd'],
  'neck-lift-detail': ['neck-lifting'],
  'botox-detail': ['jawline-filler'],
  'digital-smile-design-detail': ['dsd', 'dental'],
  'dental-veneers-detail': ['dental-veneers', 'dental-crowns'],
  'six-pack-detail': ['shutterstock'],
  'gum-aesthetic-detail': ['periodontal'],
  'breast-augmentation-detail': ['before-after'],
  'thigh-lift-detail': ['thigh-lift'],
  'tummy-tuck-detail': ['shutterstock'],
  'nose-aesthetics-rhinoplasty-detail': ['before-after'],
  'zircon-detail': ['dental-crowns', 'dental-veneers'],
  'fat-transfer-to-face-detail': ['fat-transfer'],
  'liposuction-detail': ['before-after'],
  'implant-detail-2': ['dental-crowns', 'root-canal'],
  'brow-lift-detail': ['brow-lifting', 'forehead'],
  'dental-crowns-detail': ['dental-crowns'],
  'jaw-surgery-detail': ['jawline'],
  'implant-detail': ['dental-crowns', 'root-canal'],
  'arm-lift-detail': ['arm-lifting'],
  'gynecomastia-detail': ['gynecomastia'],
  'canal-root-detail': ['root-canal'],
  'breast-reduction-detail': ['before-after'],
  'breast-lift-detail': ['before-after'],
  'bichectomy-detail': ['bichectomia']
};

// Get all image files from source directory
const sourceFiles = fs.readdirSync(sourceDir)
  .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

// Read and parse CSV file
const csvContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

parse(csvContent, {
  columns: true,
  delimiter: ',',
  trim: true,
  skip_empty_lines: true,
  relax_quotes: true,
  bom: true
}, async (err, records) => {
  if (err) {
    console.error('Error parsing CSV:', err);
    return;
  }

  for (const row of records) {
    try {
      const title = row.Title;
      if (!title) {
        console.log('Skipping row with no title');
        continue;
      }

      const sanitizedTitle = sanitizeFilename(title);
      
      // Find a matching image file using the mapping
      let matchingFile = null;
      const mappedKeywords = imageMapping[sanitizedTitle] || [];
      
      for (const keyword of mappedKeywords) {
        const found = sourceFiles.find(file => 
          file.toLowerCase().includes(keyword.toLowerCase())
        );
        if (found) {
          matchingFile = found;
          break;
        }
      }

      // If no match found through mapping, try the title keywords
      if (!matchingFile) {
        const keywords = sanitizedTitle.split('-');
        matchingFile = sourceFiles.find(file => {
          const lowerFile = file.toLowerCase();
          return keywords.some(keyword => lowerFile.includes(keyword));
        });
      }

      if (!matchingFile) {
        console.log(`No matching image found for ${title}`);
        continue;
      }

      const sourcePath = path.join(sourceDir, matchingFile);
      const extension = path.extname(matchingFile);
      const outputPath = path.join(outputDir, `${sanitizedTitle}${extension}`);

      console.log(`Copying image for ${title}...`);
      console.log(`From: ${sourcePath}`);
      console.log(`To: ${outputPath}`);

      try {
        await copyFile(sourcePath, outputPath);
        console.log(`Successfully copied image for ${title}`);
      } catch (error) {
        console.error(`Failed to copy image for ${title}:`, error.message);
      }
    } catch (error) {
      console.error(`Error processing ${row.Title}:`, error);
    }
  }

  console.log('Finished processing all services');
}); 