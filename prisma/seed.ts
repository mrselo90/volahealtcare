import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// Helper function to create JSON string for translations
function createTranslationString(en: string, tr: string) {
  return JSON.stringify({ en, tr });
}

const prisma = new PrismaClient();

// Admin user details
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123'; // In production, use a more secure password
const ADMIN_NAME = 'Admin User';

const services = [
  {
    name: 'Dental',
    services: [
      {
        name: 'Digital Smile Design',
        slug: 'digital-smile-design',
        description: 'Transform your smile with advanced digital planning technology',
        category: 'Dental',
        price: 2000,
        duration: '2-3 hours',
        images: ['/images/services/dental/digital-smile-design/1.svg']
      },
      {
        name: 'Dental Veneers',
        slug: 'dental-veneers',
        description: 'Get a perfect smile with custom-made porcelain veneers',
        category: 'Dental',
        price: 1500,
        duration: '2-4 hours',
        images: ['/images/services/dental/dental-veneers/1.svg']
      },
      {
        name: 'Hollywood Smile',
        slug: 'hollywood-smile',
        description: "Achieve the perfect celebrity smile you've always dreamed of",
        category: 'Dental',
        price: 3500,
        duration: '2-3 weeks',
        images: ['/images/services/dental/hollywood-smile/1.svg']
      },
      {
        name: 'Gum Aesthetics',
        slug: 'gum-aesthetics',
        description: 'Enhance your smile with advanced gum contouring procedures',
        category: 'Dental',
        price: 2000,
        duration: '1-2 hours',
        images: ['/images/services/dental/gum-aesthetics/1.svg']
      },
      {
        name: 'Teeth Whitening',
        slug: 'teeth-whitening',
        description: 'Get a brighter, whiter smile with our professional whitening treatments',
        category: 'Dental',
        price: 800,
        duration: '1-2 hours',
        images: ['/images/services/dental/teeth-whitening/1.svg']
      }
    ]
  },
  {
    name: 'Body',
    services: [
      {
        name: 'BBL (Brazilian Butt Lift)',
        slug: 'bbl-brazilian-butt-lift',
        description: 'Brazilian Butt Lift (BBL) is a cosmetic procedure that enhances the shape and volume of the buttocks by transferring fat from other areas of the body.',
        category: 'Body',
        price: 4500,
        duration: '4-6 hours',
        images: ['/images/services/body/bbl/1.svg']
      },
      {
        name: 'Liposuction',
        slug: 'liposuction',
        description: 'Remove stubborn fat deposits and contour your body with advanced liposuction techniques',
        category: 'Body',
        price: 3500,
        duration: '2-4 hours',
        images: ['/images/services/body/liposuction/1.svg']
      },
      {
        name: 'Tummy Tuck',
        slug: 'tummy-tuck',
        description: 'Achieve a flatter, more toned abdomen with abdominoplasty surgery',
        category: 'Body',
        price: 5000,
        duration: '3-5 hours',
        images: ['/images/services/body/tummy-tuck/1.svg']
      }
    ]
  },
  {
    name: 'Face',
    services: [
      {
        name: 'Rhinoplasty',
        slug: 'rhinoplasty',
        description: 'Reshape your nose for improved aesthetics and breathing',
        category: 'Face',
        price: 4000,
        duration: '2-3 hours',
        images: ['/images/services/face/rhinoplasty/1.svg']
      },
      {
        name: 'Face Lift',
        slug: 'face-lift',
        description: 'Turn back the clock with our advanced face lifting procedures',
        category: 'Face',
        price: 6000,
        duration: '4-6 hours',
        images: ['/images/services/face/face-lift/1.svg']
      }
    ]
  }
];

async function main() {
  console.log('Start seeding...');

  // Delete existing data
  try {
    await prisma.serviceTranslation.deleteMany();
    await prisma.image.deleteMany();
    await prisma.service.deleteMany();
  } catch (error) {
    console.log('Some tables may not exist yet, continuing with seeding...');
  }
  
  try {
    // Use type assertion to handle potential missing model in Prisma Client
    if ('category' in prisma) {
      await (prisma as any).category.deleteMany();
    } else {
      console.log('Category model not found in Prisma Client, creating categories...');
    }
  } catch (error) {
    console.log('Categories table may not exist yet, continuing with seeding...');
  }

  // Create categories
  const categoryMap = new Map();
  
  // Get unique category names
  const uniqueCategories = Array.from(new Set(services.flatMap(cat => 
    cat.services.map(s => s.category)
  ))) as string[];

  // Create each category
  for (const [index, categoryName] of Array.from(uniqueCategories.entries())) {
    // Use type assertion for category creation
    const category = await (prisma as any).category.create({
      data: {
        name: createTranslationString(categoryName, categoryName), // In a real app, add proper translations
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
        orderIndex: index,
      },
    });
    categoryMap.set(categoryName, category.id);
  }

  // Create services from the data
  for (const category of services) {
    for (const service of category.services) {
      const categoryId = categoryMap.get(service.category);
      if (!categoryId) continue;

      // Create the service with the category relation
      const serviceData = {
        title: service.name,
        slug: service.slug,
        description: service.description,
        price: service.price,
        duration: service.duration,
        currency: 'USD',
        categoryId: categoryId
      };
      
      const createdService = await (prisma as any).service.create({
        data: serviceData
      });

      // Create English translation
      await prisma.serviceTranslation.create({
        data: {
          language: 'en',
          title: service.name,
          description: service.description,
          serviceId: createdService.id
        }
      });

      // Create Turkish translation
      const trTitle = service.name === 'Teeth Whitening' ? 'Diş Beyazlatma' : service.name;
      const trDescription = service.name === 'Teeth Whitening' 
        ? 'Profesyonel diş beyazlatma tedavisi ile daha parlak ve beyaz dişlere kavuşun'
        : service.description;
      const trSlug = service.name === 'Teeth Whitening' ? 'dis-beyazlatma' : service.slug;

      await prisma.serviceTranslation.create({
        data: {
          language: 'tr',
          title: trTitle,
          description: trDescription,
          serviceId: createdService.id
        }
      });

      // Create images
      for (const imageUrl of service.images) {
        await prisma.image.create({
          data: {
            url: imageUrl,
            alt: `${service.name} Image`,
            serviceId: createdService.id,
            type: 'gallery' // Add the required type field
          }
        });
      }
    }
  }

  console.log('Seeding completed.');
}

async function createAdminUser() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    // Hash the password
    const hashedPassword = await hash(ADMIN_PASSWORD, 12);
    
    // Create admin user
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      },
    });
    
    console.log('✅ Admin user created successfully');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
  } else {
    console.log('ℹ️ Admin user already exists');
  }
}

main()
  .then(() => createAdminUser())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 