const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkServiceCategories() {
  try {
    console.log('🔍 Checking service categories...\n');

    // Brazilian Butt Lift service'ini ara
    const bblService = await prisma.service.findFirst({
      where: {
        OR: [
          { slug: 'brazilian-butt-lift' },
          { slug: 'bbl' },
          { title: { contains: 'Brazilian Butt Lift' } },
          { title: { contains: 'BBL' } }
        ]
      },
      include: {
        category: true,
        translations: true
      }
    });

    if (bblService) {
      console.log('✅ Found Brazilian Butt Lift service:');
      console.log('ID:', bblService.id);
      console.log('Slug:', bblService.slug);
      console.log('Title:', bblService.title);
      console.log('Category ID:', bblService.categoryId);
      console.log('Category Slug:', bblService.category?.slug);
      console.log('Category Name:', bblService.category?.name);
      console.log('---');
    } else {
      console.log('❌ Brazilian Butt Lift service not found');
    }

    // Tüm kategorileri listele
    console.log('\n📋 All categories:');
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { services: true }
        }
      }
    });

    categories.forEach(category => {
      console.log(`- ${category.name} (${category.slug}) - ${category._count.services} services`);
    });

    // Body kategorisindeki service'leri listele
    console.log('\n🏋️ Services in Body category:');
    const bodyCategory = await prisma.category.findFirst({
      where: { slug: 'body' },
      include: {
        services: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        }
      }
    });

    if (bodyCategory) {
      bodyCategory.services.forEach(service => {
        console.log(`- ${service.title} (${service.slug})`);
      });
    }

    // General kategorisindeki service'leri listele
    console.log('\n📄 Services in General category:');
    const generalCategory = await prisma.category.findFirst({
      where: { 
        OR: [
          { slug: 'general' },
          { slug: 'aesthetic' },
          { name: { contains: 'General' } }
        ]
      },
      include: {
        services: {
          select: {
            id: true,
            slug: true,
            title: true
          }
        }
      }
    });

    if (generalCategory) {
      console.log(`Found category: ${generalCategory.name} (${generalCategory.slug})`);
      generalCategory.services.forEach(service => {
        console.log(`- ${service.title} (${service.slug})`);
      });
    } else {
      console.log('No general category found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServiceCategories(); 