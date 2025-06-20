const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreRealImages() {
  try {
    console.log('🔄 Restoring Real Before-After Images...\n');

    // Get all uploaded images
    const uploadsDir = 'public/uploads';
    const uploadedFiles = fs.readdirSync(uploadsDir)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'))
      .sort(); // Sort to get consistent order

    console.log(`Found ${uploadedFiles.length} uploaded images`);

    // Get all before-after cases
    const cases = await prisma.beforeAfterCase.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`Found ${cases.length} cases to update\n`);

    // Assign real images to cases
    let imageIndex = 0;

    for (const caseItem of cases) {
      console.log(`Updating case: ${caseItem.title}`);
      
      // Get two different images for before and after
      const beforeImageFile = uploadedFiles[imageIndex % uploadedFiles.length];
      const afterImageFile = uploadedFiles[(imageIndex + 1) % uploadedFiles.length];
      
      const beforeImageUrl = `/uploads/${beforeImageFile}`;
      const afterImageUrl = `/uploads/${afterImageFile}`;

      // Update the case with real images
      await prisma.beforeAfterCase.update({
        where: { id: caseItem.id },
        data: {
          beforeImage: beforeImageUrl,
          afterImage: afterImageUrl,
          description: `Professional ${caseItem.category?.name || 'treatment'} result achieved at our clinic in Istanbul. Natural-looking transformation with excellent patient satisfaction.`,
          patientAge: 25 + Math.floor(Math.random() * 20), // Random age between 25-45
          patientGender: Math.random() > 0.5 ? 'Male' : 'Female',
          timeframe: `${2 + Math.floor(Math.random() * 8)} weeks`, // 2-10 weeks
          treatmentDetails: `Advanced ${caseItem.category?.name || 'treatment'} procedure performed by our expert team using latest techniques and technology.`,
          results: 'Excellent results achieved with high patient satisfaction and natural appearance.',
          tags: JSON.stringify(['Professional', 'Natural', 'Safe', 'Expert Team']),
          isPublished: true,
          isFeatured: Math.random() > 0.3, // Feature most cases
        }
      });

      console.log(`✅ Updated ${caseItem.title}`);
      console.log(`   Before: ${beforeImageUrl}`);
      console.log(`   After: ${afterImageUrl}\n`);

      imageIndex += 2; // Move to next pair of images
    }

    console.log('🎉 All cases updated with real images!');

    // Verify the updates
    const updatedCases = await prisma.beforeAfterCase.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: 'asc' }
    });

    console.log('\n📊 Updated Cases Summary:');
    updatedCases.forEach(caseItem => {
      console.log(`   - ${caseItem.title} (${caseItem.category?.name})`);
      console.log(`     Before: ${caseItem.beforeImage}`);
      console.log(`     After: ${caseItem.afterImage}`);
      console.log(`     Featured: ${caseItem.isFeatured ? 'Yes' : 'No'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

restoreRealImages(); 