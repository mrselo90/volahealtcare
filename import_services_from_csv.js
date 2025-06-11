const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { parse } = require('csv-parse');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const csvPath = path.join(__dirname, 'Dental+Treatments+Detail-02.06.2025.csv');

const requiredFields = {
  title: 'Title',
  description: 'Metin 2',
  category: 'Dental Treatment', // fallback category
  price: 0,
  duration: 'N/A',
  currency: 'USD',
  featured: false,
  availability: 'always',
  minAge: 18,
  maxAge: 99,
  prerequisites: '',
  aftercare: '',
  benefits: '',
  risks: '',
};

function slugify(text) {
  const baseSlug = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  return `${baseSlug}-${Date.now()}`;
}

function insertService(db, service, cb) {
  const now = new Date().toISOString();
  db.run(
    `INSERT INTO Service (id, title, slug, description, category, price, duration, currency, featured, availability, minAge, maxAge, prerequisites, aftercare, benefits, risks, createdAt, updatedAt, imageUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      service.title,
      slugify(service.title),
      service.description,
      service.category,
      service.price,
      service.duration,
      service.currency,
      service.featured,
      service.availability,
      service.minAge,
      service.maxAge,
      service.prerequisites,
      service.aftercare,
      service.benefits,
      service.risks,
      now,
      now,
      '/images/placeholder.svg', // Default image URL
    ],
    cb
  );
}

function main() {
  const db = new sqlite3.Database(dbPath);
  const parser = parse({ columns: true, trim: true, bom: true });
  const services = [];

  fs.createReadStream(csvPath)
    .pipe(parser)
    .on('data', (row) => {
      const service = {
        title: row['Title'] || 'Untitled',
        description: row['Metin 2'] || '',
        category: 'Dental Treatment',
        price: 0,
        duration: 'N/A',
        currency: 'USD',
        featured: false,
        availability: 'always',
        minAge: 18,
        maxAge: 99,
        prerequisites: '',
        aftercare: '',
        benefits: '',
        risks: '',
      };
      services.push(service);
    })
    .on('end', () => {
      db.serialize(() => {
        let inserted = 0;
        services.forEach((service, idx) => {
          insertService(db, service, (err) => {
            if (err) {
              console.error('Insert error:', err.message);
            } else {
              inserted++;
            }
            if (idx === services.length - 1) {
              console.log(`Inserted ${inserted} services.`);
              db.close();
            }
          });
        });
      });
    })
    .on('error', (err) => {
      console.error('CSV parse error:', err.message);
    });
}

main(); 