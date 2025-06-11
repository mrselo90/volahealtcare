import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Function to sanitize filename
const sanitizeFilename = (title: string): string => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

async function updateServiceImages() {
  try {
    // Get all services
    const services = await prisma.service.findMany({
      include: {
        images: true,
        translations: {
          orderBy: {
            language: 'asc'
          }
        }
      }
    });

    for (const service of services) {
      // Try English first, then Turkish
      const translation = service.translations.find(t => t.language === 'en') || 
                         service.translations.find(t => t.language === 'tr');
      
      if (!translation) {
        console.log(`No translation found for service ID: ${service.id}`);
        continue;
      }

      const sanitizedTitle = sanitizeFilename(translation.title + ' detail');
      
      // Check for existing image extensions
      const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      let imagePath = '';

      for (const ext of possibleExtensions) {
        const testPath = path.join(process.cwd(), 'public', 'images', 'services', `${sanitizedTitle}${ext}`);
        console.log(`Checking path: ${testPath}`);
        if (fs.existsSync(testPath)) {
          imagePath = `/images/services/${sanitizedTitle}${ext}`;
          break;
        }
      }

      if (!imagePath) {
        // Try without 'detail' suffix
        const altSanitizedTitle = sanitizeFilename(translation.title);
        for (const ext of possibleExtensions) {
          const testPath = path.join(process.cwd(), 'public', 'images', 'services', `${altSanitizedTitle}${ext}`);
          console.log(`Checking alternative path: ${testPath}`);
          if (fs.existsSync(testPath)) {
            imagePath = `/images/services/${altSanitizedTitle}${ext}`;
            break;
          }
        }
      }

      if (!imagePath) {
        console.log(`No image found for service: ${translation.title}`);
        continue;
      }

      // Update or create image
      if (service.images.length > 0) {
        // Update existing image
        await prisma.image.update({
          where: { id: service.images[0].id },
          data: {
            url: imagePath,
            alt: translation.title
          }
        });
      } else {
        // Create new image
        await prisma.image.create({
          data: {
            url: imagePath,
            alt: translation.title,
            serviceId: service.id
          }
        });
      }

      console.log(`Updated image for service: ${translation.title} with path: ${imagePath}`);
    }

    console.log('Successfully updated all service images');
  } catch (error) {
    console.error('Error updating service images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServiceImages(); 