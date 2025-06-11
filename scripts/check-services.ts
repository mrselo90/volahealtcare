import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkServices() {
  try {
    // Count total services
    const count = await prisma.service.count();
    console.log(`Total services in database: ${count}`);
    
    // Count services by category
    const byCategory = await prisma.$queryRaw`
      SELECT category, COUNT(*) as count 
      FROM Service 
      GROUP BY category
    `;
    console.log('Services by category:');
    console.log(byCategory);
    
    // List all services with basic info
    const services = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        images: {
          select: {
            url: true,
            type: true
          }
        }
      }
    });
    
    console.log('\nServices list:');
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} (${service.category}) - ${service.images.length} images`);
    });
  } catch (error) {
    console.error('Error checking services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServices();
