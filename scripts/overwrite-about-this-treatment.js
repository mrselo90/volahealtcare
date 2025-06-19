const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Helper to create slug from service name (should match import logic)
function createSlug(serviceName) {
  return serviceName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function main() {
  // Read CSV
  const csvPath = path.join(__dirname, '../../complete_scraped_services.csv');
  const services = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => services.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  let updated = 0;
  for (const row of services) {
    const slug = createSlug(row['Service Name']);
    const description = row['Description'];
    try {
      // Find the service by slug
      const service = await prisma.service.findUnique({ where: { slug } });
      if (!service) {
        console.log(`❌ Not found: ${row['Service Name']} (${slug})`);
        continue;
      }
      // Find English translation
      const translation = await prisma.serviceTranslation.findFirst({
        where: { serviceId: service.id, language: 'en' }
      });
      if (!translation) {
        console.log(`❌ No translation: ${row['Service Name']}`);
        continue;
      }
      // Overwrite content
      await prisma.serviceTranslation.update({
        where: { id: translation.id },
        data: { content: description }
      });
      console.log(`✅ Updated: ${row['Service Name']}`);
      updated++;
    } catch (e) {
      console.error(`❌ Error updating ${row['Service Name']}:`, e.message);
    }
  }
  console.log(`\n🎉 Done! Updated ${updated} services.`);
  await prisma.$disconnect();
}

main(); 