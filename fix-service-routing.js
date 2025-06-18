const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixServiceRouting() {
  try {
    console.log('🔧 Fixing service routing...\n');

    // Brazilian Butt Lift service'ini bul
    const bblService = await prisma.service.findFirst({
      where: { slug: 'brazilian-butt-lift' },
      include: { category: true }
    });

    if (!bblService) {
      console.log('❌ Brazilian Butt Lift service not found');
      return;
    }

    console.log('✅ Found service:');
    console.log('Service:', bblService.title);
    console.log('Current category:', bblService.category.name, `(${bblService.category.slug})`);
    
    // Body kategorisini bul
    const bodyCategory = await prisma.category.findFirst({
      where: { slug: 'body' }
    });

    if (!bodyCategory) {
      console.log('❌ Body category not found, creating it...');
      
      // Body kategorisini oluştur
      const newBodyCategory = await prisma.category.create({
        data: {
          slug: 'body',
          name: 'Body Procedures',
          description: 'Transform your body with our advanced surgical procedures',
          imageUrl: '/images/categories/body.jpg',
          orderIndex: 4
        }
      });
      
      console.log('✅ Created Body category:', newBodyCategory.name);
      
      // Service'i yeni kategoriye taşı
      await prisma.service.update({
        where: { id: bblService.id },
        data: { categoryId: newBodyCategory.id }
      });
      
      console.log('✅ Moved Brazilian Butt Lift to Body category');
      
    } else {
      console.log('✅ Body category exists:', bodyCategory.name);
      
      // Service'i body kategorisine taşı
      await prisma.service.update({
        where: { id: bblService.id },
        data: { categoryId: bodyCategory.id }
      });
      
      console.log('✅ Moved Brazilian Butt Lift to Body category');
    }

    // Diğer body procedure'ları da kontrol et ve taşı
    const bodyProcedures = [
      'liposuction',
      'tummy-tuck', 
      'arm-lift',
      'thigh-lift',
      'breast-augmentation',
      'breast-lift',
      'breast-reduction',
      'gynecomastia',
      'six-pack-surgery'
    ];

    console.log('\n🔄 Moving other body procedures...');
    
    for (const slug of bodyProcedures) {
      const service = await prisma.service.findFirst({
        where: { slug },
        include: { category: true }
      });
      
      if (service && service.category.slug !== 'body') {
        await prisma.service.update({
          where: { id: service.id },
          data: { categoryId: bodyCategory.id }
        });
        console.log(`✅ Moved ${service.title} to Body category`);
      }
    }

    console.log('\n📊 Final category distribution:');
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { services: true }
        }
      }
    });

    categories.forEach(category => {
      console.log(`- ${category.name} (${category.slug}): ${category._count.services} services`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixServiceRouting(); 