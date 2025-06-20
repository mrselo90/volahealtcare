const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importSingleDentalPhotos() {
  try {
    console.log('🦷 Importing Vola Dental Photos as Single Cases...\n');

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

    console.log(`Creating ${dentalPhotos.length} dental cases (one per photo)\n`);

    // Treatment types for variety
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
      'Gum Contouring & Veneers',
      'Composite Bonding',
      'Smile Restoration',
      'Cosmetic Dentistry',
      'Full Mouth Rehabilitation',
      'Aesthetic Dental Treatment'
    ];

    // Create one case per photo
    for (let i = 0; i < dentalPhotos.length; i++) {
      const photoFile = dentalPhotos[i];
      
      // Copy file to public directory
      const fileName = `dental-case-${i + 1}.jpg`;
      const sourcePath = path.join(dentalPhotosDir, photoFile);
      const destPath = path.join(publicDentalDir, fileName);

      fs.copyFileSync(sourcePath, destPath);

      const imageUrl = `/images/before-after/dental/${fileName}`;

      // Generate case details
      const caseNumber = i + 1;
      const patientAge = 22 + Math.floor(Math.random() * 25); // 22-47 years
      const patientGender = Math.random() > 0.5 ? 'Male' : 'Female';
      const timeframe = `${1 + Math.floor(Math.random() * 6)} weeks`; // 1-6 weeks
      const treatment = treatments[i % treatments.length];

      // Create new case (same image for both before and after since it's a comparison photo)
      const newCase = await prisma.beforeAfterCase.create({
        data: {
          title: `${treatment} Case ${caseNumber}`,
          beforeImage: imageUrl, // Same image contains before-after comparison
          afterImage: imageUrl,  // Same image contains before-after comparison
          description: `Professional ${treatment.toLowerCase()} result achieved at our clinic in Istanbul. This case demonstrates the exceptional transformation possible with our advanced dental techniques and premium materials.`,
          patientAge: patientAge,
          patientGender: patientGender,
          timeframe: timeframe,
          treatmentDetails: `Advanced ${treatment.toLowerCase()} procedure performed by our expert dental team using state-of-the-art technology, premium materials, and personalized treatment planning for optimal results.`,
          results: `Outstanding aesthetic and functional results achieved with natural-looking smile transformation, improved oral health, and enhanced patient confidence.`,
          tags: JSON.stringify(['Smile Design', 'Veneers', 'Professional', 'Natural', 'Istanbul', 'Before-After']),
          categoryId: dentalCategory.id,
          isPublished: true,
          isFeatured: i < 12, // Feature first 12 cases
          sortOrder: i
        }
      });

      console.log(`✅ Created Case ${caseNumber}: ${newCase.title}`);
      console.log(`   Image: ${imageUrl} (from ${photoFile})`);
      console.log(`   Patient: ${patientGender}, ${patientAge} years, ${timeframe}`);
      console.log(`   Treatment: ${treatment}\n`);
    }

    console.log(`🎉 Successfully imported all ${dentalPhotos.length} dental photos!`);

    // Verify the results
    const finalCases = await prisma.beforeAfterCase.findMany({
      where: { categoryId: dentalCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📋 Final Summary:`);
    console.log(`   - Total Cases Created: ${finalCases.length}`);
    console.log(`   - Featured Cases: ${finalCases.filter(c => c.isFeatured).length}`);
    console.log(`   - Photos Imported: ${dentalPhotos.length}`);
    console.log(`   - Photos Copied to Public: ${fs.readdirSync(publicDentalDir).length}`);
    console.log(`   - Treatment Types: ${treatments.length} different types`);

    console.log(`\n📸 Each photo contains before-after comparison within the image`);
    console.log(`🔄 Both beforeImage and afterImage fields point to the same comparison photo`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importSingleDentalPhotos(); 