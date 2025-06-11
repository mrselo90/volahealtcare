import { PrismaClient } from '@prisma/client';
import { services } from '../src/data/services.js';

const prisma = new PrismaClient();

async function seedServices() {
  try {
    console.log('Starting to seed services...');

    for (const category of services) {
      for (const service of category.services) {
        // Create the service
        const createdService = await prisma.service.create({
          data: {
            title: service.name,
            slug: service.slug,
            description: service.description,
            category: category.slug,
            price: service.priceRange[0], // Using the minimum price
            duration: service.duration,
            benefits: service.benefits.join('\n'),
            translations: {
              create: {
                language: 'en',
                title: service.name,
                description: service.longDescription,
              },
            },
            images: {
              create: service.images.map((url: string, index: number) => ({
                url,
                alt: `${service.name} - Image ${index + 1}`,
                type: index === 0 ? 'featured' : 'gallery',
              })),
            },
            faqs: {
              create: service.faqs.map((faq: { question: string; answer: string }) => ({
                question: faq.question,
                answer: faq.answer,
                translations: {
                  create: {
                    language: 'en',
                    question: faq.question,
                    answer: faq.answer,
                  },
                },
              })),
            },
          },
        });

        console.log(`Created service: ${createdService.title}`);
      }
    }

    console.log('Successfully seeded all services!');
  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedServices(); 