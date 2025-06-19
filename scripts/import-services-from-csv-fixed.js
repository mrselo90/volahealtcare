const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Function to create slug from service name
function createSlug(serviceName) {
  return serviceName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Function to parse CSV line properly handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  return result;
}

// Function to parse package details from Package Includes column
function parsePackageDetails(packageIncludes) {
  const details = {
    accommodation: '',
    transportation: '',
    hospitalStay: ''
  };

  if (!packageIncludes) return details;

  // Extract accommodation (Hotel info)
  const hotelMatch = packageIncludes.match(/([\d\/\*\s]*Hotel)/i);
  if (hotelMatch) {
    details.accommodation = hotelMatch[1].trim();
  }

  // Extract transportation
  const transportMatch = packageIncludes.match(/(VIP [^+]*)/i);
  if (transportMatch) {
    details.transportation = transportMatch[1].trim();
  }

  // Extract hospital stay
  const hospitalMatch = packageIncludes.match(/(\d+(?:-\d+)?\s*Nights?\s*Hospital(?:\s*Stay)?)/i);
  if (hospitalMatch) {
    details.hospitalStay = hospitalMatch[1].trim();
  } else if (packageIncludes.includes('Day Case')) {
    details.hospitalStay = 'Day Case';
  }

  return details;
}

// Function to clean and extract main content from description
function cleanDescription(description) {
  if (!description) return '';
  
  // Remove navigation menus, forms, and other UI elements
  let cleaned = description
    .replace(/Vola Health Istanbul[\s\S]*?Use tab to navigate through the menu items\./g, '')
    .replace(/WhatsApp_icon\.png/g, '')
    .replace(/Facebook_Logo\.png/g, '')
    .replace(/## Let Us Call You[\s\S]*?Thanks for sending!/g, '')
    .replace(/Hours of Operation[\s\S]*?Open 24\/7/g, '')
    .replace(/Online Appointment/g, '')
    .replace(/## Details[\s\S]*?## Transportation/g, '')
    .replace(/## Time In Turkey[\s\S]*?VIP Car & Driver/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

async function importServicesFromCSV() {
  try {
    console.log('🚀 Starting CSV import process...');

    // First, let's clean up the wrong categories created in the previous import
    console.log('🧹 Cleaning up incorrect categories...');
    
    // Delete services with wrong categories first
    const wrongServices = await prisma.service.findMany({
      where: {
        category: {
          slug: {
            not: {
              in: ['aesthetic-treatments', 'dental-treatments', 'hair-transplant']
            }
          }
        }
      }
    });

    console.log(`Found ${wrongServices.length} services with incorrect categories`);
    
    for (const service of wrongServices) {
      await prisma.service.delete({
        where: { id: service.id }
      });
    }

    // Delete wrong categories
    await prisma.category.deleteMany({
      where: {
        slug: {
          not: {
            in: ['aesthetic-treatments', 'dental-treatments', 'hair-transplant']
          }
        }
      }
    });

    console.log('✅ Cleanup completed');

    // Read CSV file
    const csvPath = path.join(__dirname, '../../complete_vola_health_services.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');

    console.log('📄 Processing CSV...');

    // Parse CSV data with proper handling
    const services = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const row = parseCSVLine(lines[i]);
      
      if (row.length >= 6) {
        const packageDetails = parsePackageDetails(row[6]);
        
        services.push({
          category: row[0], // Service Category
          name: row[1],     // Service Name  
          description: cleanDescription(row[2]), // Description
          timeInTurkey: row[3],    // Time in Turkey
          recovery: row[4],        // Recovery
          operationTime: row[5],   // Operation Time
          packageIncludes: row[6], // Package Includes
          ...packageDetails
        });
      }
    }

    console.log(`📊 Parsed ${services.length} services from CSV`);

    // Get or create categories
    const categoryMap = new Map();
    const uniqueCategories = [...new Set(services.map(s => s.category))];
    
    console.log('🏷️ Categories found:', uniqueCategories);

    for (const categoryName of uniqueCategories) {
      let categorySlug;
      let dbCategoryName;
      
      // Map category names to proper slugs and database names
      switch (categoryName) {
        case 'Plastic Surgery':
          categorySlug = 'aesthetic-treatments';
          dbCategoryName = '{"en":"Aesthetic Treatments","tr":"Estetik Tedaviler"}';
          break;
        case 'Dental Treatments':
          categorySlug = 'dental-treatments';
          dbCategoryName = '{"en":"Dental Treatments","tr":"Diş Tedavileri"}';
          break;
        case 'Hair Transplant':
          categorySlug = 'hair-transplant';
          dbCategoryName = '{"en":"Hair Transplant","tr":"Saç Ekimi"}';
          break;
        default:
          console.log(`⚠️ Unknown category: ${categoryName}`);
          continue; // Skip unknown categories
      }

      // Check if category exists
      let category = await prisma.category.findFirst({
        where: { slug: categorySlug }
      });

      if (!category) {
        console.log(`➕ Creating category: ${categoryName} (${categorySlug})`);
        
        // Get the highest orderIndex
        const lastCategory = await prisma.category.findFirst({
          orderBy: { orderIndex: 'desc' }
        });
        const orderIndex = lastCategory ? lastCategory.orderIndex + 1 : 0;

        category = await prisma.category.create({
          data: {
            name: dbCategoryName,
            description: '{}',
            slug: categorySlug,
            orderIndex
          }
        });
      }

      categoryMap.set(categoryName, category.id);
    }

    console.log('📁 Category mapping completed');

    // Import services
    let importedCount = 0;
    let skippedCount = 0;

    for (const serviceData of services) {
      if (!categoryMap.has(serviceData.category)) {
        console.log(`⚠️ Skipping service with unknown category: ${serviceData.name} (${serviceData.category})`);
        skippedCount++;
        continue;
      }

      const slug = createSlug(serviceData.name);
      
      // Check if service already exists
      const existingService = await prisma.service.findFirst({
        where: { slug }
      });

      if (existingService) {
        console.log(`⏭️ Skipping existing service: ${serviceData.name}`);
        skippedCount++;
        continue;
      }

      try {
        console.log(`➕ Creating service: ${serviceData.name}`);

        const service = await prisma.service.create({
          data: {
            title: serviceData.name,
            slug: slug,
            description: serviceData.description.substring(0, 500) + (serviceData.description.length > 500 ? '...' : ''), // Short description
            categoryId: categoryMap.get(serviceData.category),
            featured: false,
            availability: 'always',
            minAge: 18,
            maxAge: 99,
            // Package details
            timeInTurkey: serviceData.timeInTurkey || null,
            operationTime: serviceData.operationTime || null,
            recovery: serviceData.recovery || null,
            hospitalStay: serviceData.hospitalStay || null,
            accommodation: serviceData.accommodation || null,
            transportation: serviceData.transportation || null,
            // Create English translation with full content
            translations: {
              create: {
                language: 'en',
                title: serviceData.name,
                description: serviceData.description.substring(0, 500) + (serviceData.description.length > 500 ? '...' : ''),
                content: serviceData.description // Full content here
              }
            }
          },
          include: {
            translations: true
          }
        });

        importedCount++;
        console.log(`✅ Created service: ${service.title} (${service.slug})`);

      } catch (error) {
        console.error(`❌ Error creating service ${serviceData.name}:`, error.message);
      }
    }

    console.log('\n🎉 Import completed!');
    console.log(`✅ Imported: ${importedCount} services`);
    console.log(`⏭️ Skipped: ${skippedCount} services`);
    console.log(`📊 Total processed: ${services.length} services`);

  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importServicesFromCSV(); 