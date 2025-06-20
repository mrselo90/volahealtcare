const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function assignDentalPhotos() {
  try {
    console.log('🦷 Assigning Vola Dental Photos to Before-After Cases...\n');

    // Get all dental photos
    const dentalPhotosDir = 'website2/photos/VOLA/Vola Dental ';
    const dentalPhotos = fs.readdirSync(dentalPhotosDir)
      .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
      .sort((a, b) => {
        // Sort by number if possible
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    console.log(`Found ${dentalPhotos.length} dental photos`);

    // Get dental category ID
    const dentalCategory = await prisma.category.findFirst({
      where: { slug: 'dental-treatments' }
    });

    if (!dentalCategory) {
      console.error('❌ Dental category not found!');
      return;
    }

    // Get all dental before-after cases
    const dentalCases = await prisma.beforeAfterCase.findMany({
      where: { categoryId: dentalCategory.id },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${dentalCases.length} dental cases to update\n`);

    // Copy photos to public directory first
    const publicDentalDir = 'website2/public/images/before-after/dental';
    if (!fs.existsSync(publicDentalDir)) {
      fs.mkdirSync(publicDentalDir, { recursive: true });
    }

    // Assign photos to cases
    let photoIndex = 0;

    for (let i = 0; i < dentalCases.length; i++) {
      const caseItem = dentalCases[i];
      console.log(`Updating case: ${caseItem.title}`);

      // Get before and after photos
      const beforePhotoFile = dentalPhotos[photoIndex % dentalPhotos.length];
      const afterPhotoFile = dentalPhotos[(photoIndex + 1) % dentalPhotos.length];

      // Copy files to public directory
      const beforeFileName = `dental-before-${i + 1}.jpg`;
      const afterFileName = `dental-after-${i + 1}.jpg`;

      const beforeSourcePath = path.join(dentalPhotosDir, beforePhotoFile);
      const afterSourcePath = path.join(dentalPhotosDir, afterPhotoFile);
      const beforeDestPath = path.join(publicDentalDir, beforeFileName);
      const afterDestPath = path.join(publicDentalDir, afterFileName);

      // Copy files
      fs.copyFileSync(beforeSourcePath, beforeDestPath);
      fs.copyFileSync(afterSourcePath, afterDestPath);

      const beforeImageUrl = `/images/before-after/dental/${beforeFileName}`;
      const afterImageUrl = `/images/before-after/dental/${afterFileName}`;

      // Update the case
      await prisma.beforeAfterCase.update({
        where: { id: caseItem.id },
        data: {
          beforeImage: beforeImageUrl,
          afterImage: afterImageUrl,
          description: `Professional dental treatment result achieved at our clinic in Istanbul. This case shows the transformation of a patient's smile using advanced dental techniques and materials.`,
          patientAge: 25 + Math.floor(Math.random() * 20),
          patientGender: Math.random() > 0.5 ? 'Male' : 'Female',
          timeframe: `${1 + Math.floor(Math.random() * 4)} weeks`,
          treatmentDetails: `Advanced dental procedure including smile design, veneers, and comprehensive oral care performed by our expert dental team using state-of-the-art technology.`,
          results: 'Excellent aesthetic and functional results achieved with natural-looking smile transformation and improved oral health.',
          tags: JSON.stringify(['Smile Design', 'Veneers', 'Professional', 'Natural', 'Istanbul']),
          isPublished: true,
          isFeatured: i < 2, // Feature first 2 cases
        }
      });

      console.log(`✅ Updated ${caseItem.title}`);
      console.log(`   Before: ${beforeImageUrl} (from ${beforePhotoFile})`);
      console.log(`   After: ${afterImageUrl} (from ${afterPhotoFile})\n`);

      photoIndex += 2; // Move to next pair
    }

    console.log('🎉 All dental cases updated with Vola Dental photos!');

    // Verify the updates
    const updatedCases = await prisma.beforeAfterCase.findMany({
      where: { categoryId: dentalCategory.id },
      orderBy: { createdAt: 'asc' }
    });

    console.log('\n📊 Updated Dental Cases Summary:');
    updatedCases.forEach((caseItem, index) => {
      console.log(`   ${index + 1}. ${caseItem.title}`);
      console.log(`      Before: ${caseItem.beforeImage}`);
      console.log(`      After: ${caseItem.afterImage}`);
      console.log(`      Featured: ${caseItem.isFeatured ? 'Yes' : 'No'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignDentalPhotos(); 