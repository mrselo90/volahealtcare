const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBeforeAfterCases() {
  try {
    console.log('🔍 Checking Before-After Cases in Database...\n');

    // Get all categories first
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      }
    });

    console.log('📂 Available Categories:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug}) - ID: ${cat.id}`);
    });
    console.log('');

    // Get total count of before-after cases
    const totalCases = await prisma.beforeAfterCase.count();
    console.log(`📊 Total Before-After Cases: ${totalCases}`);

    // Get published cases
    const publishedCases = await prisma.beforeAfterCase.count({
      where: { isPublished: true }
    });
    console.log(`✅ Published Cases: ${publishedCases}`);

    // Get cases by category
    console.log('\n📋 Cases by Category:');
    for (const category of categories) {
      const categoryCount = await prisma.beforeAfterCase.count({
        where: { 
          categoryId: category.id,
          isPublished: true 
        }
      });
      console.log(`   - ${category.name}: ${categoryCount} cases`);
    }

    // Get some sample cases
    const sampleCases = await prisma.beforeAfterCase.findMany({
      take: 5,
      include: {
        category: true,
      },
      where: { isPublished: true }
    });

    console.log('\n🔍 Sample Cases:');
    sampleCases.forEach(caseItem => {
      console.log(`   - ${caseItem.title} (Category: ${caseItem.category?.name || 'No Category'})`);
      console.log(`     Before: ${caseItem.beforeImageUrl || 'No image'}`);
      console.log(`     After: ${caseItem.afterImageUrl || 'No image'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBeforeAfterCases(); 