const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkOriginalImages() {
  try {
    console.log('🔍 Checking Original Before-After Images...\n');

    // Get all before-after cases with all fields
    const cases = await prisma.beforeAfterCase.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`Found ${cases.length} cases:\n`);

    cases.forEach((caseItem, index) => {
      console.log(`${index + 1}. ${caseItem.title}`);
      console.log(`   Category: ${caseItem.category?.name || 'No Category'}`);
      console.log(`   Before Image: ${caseItem.beforeImage || 'NULL'}`);
      console.log(`   After Image: ${caseItem.afterImage || 'NULL'}`);
      console.log(`   Created: ${caseItem.createdAt}`);
      console.log(`   Updated: ${caseItem.updatedAt}`);
      console.log(`   Featured: ${caseItem.isFeatured}`);
      console.log(`   Published: ${caseItem.isPublished}`);
      console.log('');
    });

    // Check if there are any uploads folder images
    console.log('📁 Checking uploads folder structure...');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOriginalImages(); 