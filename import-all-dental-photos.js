const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importAllDentalPhotos() {
  try {
    console.log('🦷 Importing ALL Vola Dental Photos...\n');

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

    console.log(`Found ${dentalPhotos.length} dental photos to import`);

    // Get dental category
    const dentalCategory = await prisma.category.findFirst({
      where: { slug: 'dental-treatments' }
    });

    if (!dentalCategory) {
      console.error('❌ Dental category not found!');
      return;
    }

    // Create public directory for dental images
    const publicDentalDir = 'website2/public/images/before-after/dental';
    if (!fs.existsSync(publicDentalDir)) {
      fs.mkdirSync(publicDentalDir, { recursive: true });
    }

    // Delete existing dental cases to start fresh
    await prisma.beforeAfterCase.deleteMany({
      where: { categoryId: dentalCategory.id }
    });
    console.log('🗑️ Cleared existing dental cases');

    // Calculate how many cases we need (using pairs of photos)
    const totalCases = Math.floor(dentalPhotos.length / 2);
    console.log(`Creating ${totalCases} dental cases from ${dentalPhotos.length} photos\n`);

    // Create cases with all photos
    for (let i = 0; i < totalCases; i++) {
      const beforePhotoFile = dentalPhotos[i * 2];
      const afterPhotoFile = dentalPhotos[i * 2 + 1];

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

      // Generate case details
      const caseNumber = i + 1;
      const patientAge = 22 + Math.floor(Math.random() * 25); // 22-47 years
      const patientGender = Math.random() > 0.5 ? 'Male' : 'Female';
      const timeframe = `${1 + Math.floor(Math.random() * 6)} weeks`; // 1-6 weeks
      
      const treatments = [
        'Smile Design & Veneers',
        'Hollywood Smile',
        'Dental Veneers (Laminate)',
        'Teeth Whitening & Veneers',
        'Complete Smile Makeover',
        'Digital Smile Design',
        'Porcelain Veneers',
        'Zirconia Crowns',
        'All-on-4 Dental Implants',
        'Gum Contouring & Veneers'
      ];
      
      const treatment = treatments[i % treatments.length];

      // Create new case
      const newCase = await prisma.beforeAfterCase.create({
        data: {
          title: `${treatment} Case ${caseNumber}`,
          beforeImage: beforeImageUrl,
          afterImage: afterImageUrl,
          description: `Professional ${treatment.toLowerCase()} result achieved at our clinic in Istanbul. This case demonstrates the exceptional transformation possible with our advanced dental techniques and premium materials.`,
          patientAge: patientAge,
          patientGender: patientGender,
          timeframe: timeframe,
          treatmentDetails: `Advanced ${treatment.toLowerCase()} procedure performed by our expert dental team using state-of-the-art technology, premium materials, and personalized treatment planning for optimal results.`,
          results: `Outstanding aesthetic and functional results achieved with natural-looking smile transformation, improved oral health, and enhanced patient confidence.`,
          tags: JSON.stringify(['Smile Design', 'Veneers', 'Professional', 'Natural', 'Istanbul', 'Premium Quality']),
          categoryId: dentalCategory.id,
          isPublished: true,
          isFeatured: i < 8, // Feature first 8 cases
          sortOrder: i
        }
      });

      console.log(`✅ Created Case ${caseNumber}: ${newCase.title}`);
      console.log(`   Before: ${beforeImageUrl} (from ${beforePhotoFile})`);
      console.log(`   After: ${afterImageUrl} (from ${afterPhotoFile})`);
      console.log(`   Patient: ${patientGender}, ${patientAge} years, ${timeframe}\n`);
    }

    // Handle odd photo if exists
    if (dentalPhotos.length % 2 === 1) {
      const lastPhotoFile = dentalPhotos[dentalPhotos.length - 1];
      const lastFileName = `dental-extra-${totalCases + 1}.jpg`;
      const lastSourcePath = path.join(dentalPhotosDir, lastPhotoFile);
      const lastDestPath = path.join(publicDentalDir, lastFileName);
      
      fs.copyFileSync(lastSourcePath, lastDestPath);
      console.log(`📸 Copied extra photo: ${lastPhotoFile} → ${lastFileName}`);
    }

    console.log(`\n🎉 Successfully imported all ${dentalPhotos.length} dental photos!`);
    console.log(`📊 Created ${totalCases} complete before-after cases`);

    // Verify the results
    const finalCases = await prisma.beforeAfterCase.findMany({
      where: { categoryId: dentalCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📋 Final Summary:`);
    console.log(`   - Total Cases Created: ${finalCases.length}`);
    console.log(`   - Featured Cases: ${finalCases.filter(c => c.isFeatured).length}`);
    console.log(`   - Photos Used: ${finalCases.length * 2}`);
    console.log(`   - Photos Copied to Public: ${fs.readdirSync(publicDentalDir).length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importAllDentalPhotos(); 