const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importPlasticPhotos() {
  try {
    console.log('💉 Importing Vola Plastic Photos as Single Cases...\n');

    // Get all plastic surgery photos
    const plasticPhotosDir = 'website2/photos/VOLA/Vola Plastic';
    const plasticPhotos = fs.readdirSync(plasticPhotosDir)
      .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
      .sort((a, b) => {
        // Sort by number if possible
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      });

    console.log(`Found ${plasticPhotos.length} plastic surgery photos to import`);

    // Get aesthetic category
    const aestheticCategory = await prisma.category.findFirst({
      where: { slug: 'aesthetic-treatments' }
    });

    if (!aestheticCategory) {
      console.error('❌ Aesthetic category not found!');
      return;
    }

    // Create public directory for plastic surgery images
    const publicPlasticDir = 'website2/public/images/before-after/plastic';
    if (!fs.existsSync(publicPlasticDir)) {
      fs.mkdirSync(publicPlasticDir, { recursive: true });
    }

    // Delete existing plastic surgery cases to start fresh
    await prisma.beforeAfterCase.deleteMany({
      where: { categoryId: aestheticCategory.id }
    });
    console.log('🗑️ Cleared existing plastic surgery cases');

    console.log(`Creating ${plasticPhotos.length} plastic surgery cases (one per photo)\n`);

    // Treatment types for variety
    const treatments = [
      'Rhinoplasty (Nose Job)',
      'Brazilian Butt Lift (BBL)',
      'Breast Augmentation',
      'Breast Reduction',
      'Tummy Tuck (Abdominoplasty)',
      'Liposuction',
      'Facelift',
      'Blepharoplasty (Eyelid Surgery)',
      'Bichectomy',
      'Gynecomastia Surgery',
      'Arm Lift (Brachioplasty)',
      'Thigh Lift',
      'Mommy Makeover',
      'Body Contouring',
      'Fat Transfer'
    ];

    // Create one case per photo
    for (let i = 0; i < plasticPhotos.length; i++) {
      const photoFile = plasticPhotos[i];
      
      // Copy file to public directory
      const fileName = `plastic-case-${i + 1}.jpg`;
      const sourcePath = path.join(plasticPhotosDir, photoFile);
      const destPath = path.join(publicPlasticDir, fileName);

      fs.copyFileSync(sourcePath, destPath);

      const imageUrl = `/images/before-after/plastic/${fileName}`;

      // Generate case details
      const caseNumber = i + 1;
      const patientAge = 22 + Math.floor(Math.random() * 23); // 22-45 years
      const patientGender = Math.random() > 0.3 ? 'Female' : 'Male'; // Mostly female
      const timeframe = `${2 + Math.floor(Math.random() * 10)} weeks`; // 2-12 weeks
      const treatment = treatments[i % treatments.length];

      // Create new case
      const newCase = await prisma.beforeAfterCase.create({
        data: {
          title: `${treatment} Case ${caseNumber}`,
          beforeImage: imageUrl, // Same image contains before-after comparison
          afterImage: imageUrl,  // Same image contains before-after comparison
          description: `Professional ${treatment.toLowerCase()} result achieved at our clinic in Istanbul. This case demonstrates natural-looking aesthetic enhancement with excellent surgical precision and patient satisfaction.`,
          patientAge: patientAge,
          patientGender: patientGender,
          timeframe: timeframe,
          treatmentDetails: `Advanced ${treatment.toLowerCase()} procedure performed by our expert plastic surgery team using state-of-the-art techniques, premium materials, and personalized surgical planning for optimal aesthetic results.`,
          results: `Outstanding aesthetic results achieved with natural appearance, improved body contour, enhanced self-confidence, and high patient satisfaction. Minimal scarring and excellent healing process.`,
          tags: JSON.stringify(['Plastic Surgery', 'Aesthetic', 'Natural', 'Professional', 'Istanbul', 'Body Contouring']),
          categoryId: aestheticCategory.id,
          isPublished: true,
          isFeatured: i < 4, // Feature first 4 cases (since only 6 total)
          sortOrder: i
        }
      });

      console.log(`✅ Created Case ${caseNumber}: ${newCase.title}`);
      console.log(`   Image: ${imageUrl} (from ${photoFile})`);
      console.log(`   Patient: ${patientGender}, ${patientAge} years, ${timeframe}`);
      console.log(`   Treatment: ${treatment}\n`);
    }

    console.log(`🎉 Successfully imported all ${plasticPhotos.length} plastic surgery photos!`);

    // Verify the results
    const finalCases = await prisma.beforeAfterCase.findMany({
      where: { categoryId: aestheticCategory.id },
      orderBy: { sortOrder: 'asc' }
    });

    console.log(`\n📋 Final Summary:`);
    console.log(`   - Total Cases Created: ${finalCases.length}`);
    console.log(`   - Featured Cases: ${finalCases.filter(c => c.isFeatured).length}`);
    console.log(`   - Photos Imported: ${plasticPhotos.length}`);
    console.log(`   - Photos Copied to Public: ${fs.readdirSync(publicPlasticDir).length}`);
    console.log(`   - Treatment Types: ${treatments.length} different types`);

    console.log(`\n📸 Each photo contains before-after comparison within the image`);
    console.log(`🔄 Both beforeImage and afterImage fields point to the same comparison photo`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importPlasticPhotos(); 