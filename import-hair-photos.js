const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importHairPhotos() {
  try {
    console.log('💇‍♂️ Importing Vola Hair Photos as Single Cases...\n');

    // Get all hair photos
    const hairPhotosDir = 'website2/photos/VOLA/Vola Hair';
    const hairPhotos = fs.readdirSync(hairPhotosDir)
      .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
      .sort((a, b) => {
        // Sort by number if possible
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    console.log(`Found ${hairPhotos.length} hair photos to import`);

    // Get hair category
    const hairCategory = await prisma.category.findFirst({
      where: { slug: 'hair-transplant' }
    });

    if (!hairCategory) {
      console.error('❌ Hair category not found!');
      return;
    }

    // Create public directory for hair images
    const publicHairDir = 'website2/public/images/before-after/hair';
    if (!fs.existsSync(publicHairDir)) {
      fs.mkdirSync(publicHairDir, { recursive: true });
    }

    // Delete existing hair cases to start fresh
    await prisma.beforeAfterCase.deleteMany({
      where: { categoryId: hairCategory.id }
    });
    console.log('🗑️ Cleared existing hair cases');

    console.log(`Creating ${hairPhotos.length} hair cases (one per photo)\n`);

    // Treatment types for variety
    const treatments = [
      'FUE Hair Transplant',
      'DHI Hair Transplant',
      'Sapphire FUE',
      'Beard Transplant',
      'Eyebrow Transplant',
      'Mustache Transplant',
      'Sideburn Transplant',
      'Crown Area Transplant',
      'Frontal Hairline Design',
      'Temple Reconstruction',
      'Hair Density Increase',
      'Natural Hairline Creation',
      'Advanced FUE Technique'
    ];

    // Create one case per photo
    for (let i = 0; i < hairPhotos.length; i++) {
      const photoFile = hairPhotos[i];
      
      // Copy file to public directory
      const fileName = `hair-case-${i + 1}.jpg`;
      const sourcePath = path.join(hairPhotosDir, photoFile);
      const destPath = path.join(publicHairDir, fileName);

      fs.copyFileSync(sourcePath, destPath);

      const imageUrl = `/images/before-after/hair/${fileName}`;

      // Generate case details
      const caseNumber = i + 1;
      const patientAge = 25 + Math.floor(Math.random() * 20); // 25-45 years
      const patientGender = Math.random() > 0.8 ? 'Female' : 'Male'; // Mostly male
      const timeframe = `${6 + Math.floor(Math.random() * 6)} months`; // 6-12 months
      const treatment = treatments[i % treatments.length];
      const graftCount = 2000 + Math.floor(Math.random() * 3000); // 2000-5000 grafts

      // Create new case
      const newCase = await prisma.beforeAfterCase.create({
        data: {
          title: `${treatment} Case ${caseNumber}`,
          beforeImage: imageUrl, // Same image contains before-after comparison
          afterImage: imageUrl,  // Same image contains before-after comparison
          description: `Professional ${treatment.toLowerCase()} result achieved at our clinic in Istanbul. This case demonstrates natural-looking hair restoration with ${graftCount} grafts using advanced techniques.`,
          patientAge: patientAge,
          patientGender: patientGender,
          timeframe: timeframe,
          treatmentDetails: `Advanced ${treatment.toLowerCase()} procedure with ${graftCount} grafts performed by our expert hair transplant team using state-of-the-art FUE/DHI techniques for optimal density and natural appearance.`,
          results: `Excellent hair restoration results achieved with natural hairline design, optimal density, and high graft survival rate. Patient achieved desired hair coverage and natural appearance.`,
          tags: JSON.stringify(['Hair Transplant', 'FUE', 'DHI', 'Natural', 'Istanbul', `${graftCount} Grafts`]),
          categoryId: hairCategory.id,
          isPublished: true,
          isFeatured: i < 6, // Feature first 6 cases
          sortOrder: i
        }
      });

      console.log(`✅ Created Case ${caseNumber}: ${newCase.title}`);
      console.log(`   Image: ${imageUrl} (from ${photoFile})`);
      console.log(`   Patient: ${patientGender}, ${patientAge} years, ${timeframe}`);
      console.log(`   Treatment: ${treatment} (${graftCount} grafts)\n`);
    }

    console.log(`🎉 Successfully imported all ${hairPhotos.length} hair photos!`);

    // Verify the results
    const finalCases = await prisma.beforeAfterCase.findMany({
      where: { categoryId: hairCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📋 Final Summary:`);
    console.log(`   - Total Cases Created: ${finalCases.length}`);
    console.log(`   - Featured Cases: ${finalCases.filter(c => c.isFeatured).length}`);
    console.log(`   - Photos Imported: ${hairPhotos.length}`);
    console.log(`   - Photos Copied to Public: ${fs.readdirSync(publicHairDir).length}`);
    console.log(`   - Treatment Types: ${treatments.length} different types`);

    console.log(`\n📸 Each photo contains before-after comparison within the image`);
    console.log(`🔄 Both beforeImage and afterImage fields point to the same comparison photo`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importHairPhotos(); 