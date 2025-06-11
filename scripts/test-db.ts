import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseOperations() {
  try {
    // Test READ operation
    console.log('Testing READ operation...');
    const services = await prisma.service.findMany();
    console.log(`✓ Successfully read ${services.length} services`);

    // Test CREATE operation
    console.log('\nTesting CREATE operation...');
    const newService = await prisma.service.create({
      data: {
        title: 'Test Service',
        slug: 'test-service',
        description: 'This is a test service',
        category: 'test',
      },
    });
    console.log('✓ Successfully created new service:', newService.id);

    // Test UPDATE operation
    console.log('\nTesting UPDATE operation...');
    const updatedService = await prisma.service.update({
      where: { id: newService.id },
      data: {
        title: 'Updated Test Service',
        description: 'This is an updated test service',
      },
    });
    console.log('✓ Successfully updated service:', updatedService.id);

    // Test DELETE operation
    console.log('\nTesting DELETE operation...');
    const deletedService = await prisma.service.delete({
      where: { id: newService.id },
    });
    console.log('✓ Successfully deleted service:', deletedService.id);

    // Test Relations (Create service with image)
    console.log('\nTesting Relations...');
    const serviceWithImage = await prisma.service.create({
      data: {
        title: 'Service with Image',
        slug: 'service-with-image',
        description: 'This is a service with an image',
        category: 'test',
        images: {
          create: {
            url: 'https://example.com/image.jpg',
            alt: 'Test Image',
          },
        },
      },
      include: {
        images: true,
      },
    });
    console.log('✓ Successfully created service with image:', serviceWithImage.id);

    // Clean up the test data
    await prisma.service.delete({
      where: { id: serviceWithImage.id },
    });
    console.log('\n✓ All database operations completed successfully!');

  } catch (error) {
    console.error('Error during database operations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseOperations(); 