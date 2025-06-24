const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Safety check function
async function performSafetyChecks() {
  console.log('🔒 Performing safety checks...');
  
  try {
    // Check if database is accessible
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK');
    
    // Check database size
    const dbPath = './dev.db';
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`📊 Database size: ${sizeInMB} MB`);
      
      // Warn if database is large
      if (stats.size > 100 * 1024 * 1024) { // 100MB
        console.warn('⚠️  Large database detected. VACUUM may take longer.');
      }
    }
    
    // Check free disk space (basic check)
    console.log('✅ Safety checks passed');
    return true;
  } catch (error) {
    console.error('❌ Safety check failed:', error);
    return false;
  }
}

// Create backup function
async function createBackup() {
  const dbPath = './dev.db';
  const backupPath = `./dev.db.backup.${Date.now()}`;
  
  try {
    if (fs.existsSync(dbPath)) {
      console.log('💾 Creating database backup...');
      fs.copyFileSync(dbPath, backupPath);
      console.log(`✅ Backup created: ${backupPath}`);
      return backupPath;
    }
  } catch (error) {
    console.error('❌ Backup creation failed:', error);
    throw error;
  }
}

async function optimizeDatabase(options = {}) {
  const { skipBackup = false, skipVacuum = false } = options;
  
  console.log('🗄️  Starting database optimization...\n');

  // Safety checks
  const safetyOK = await performSafetyChecks();
  if (!safetyOK) {
    console.error('❌ Safety checks failed. Aborting optimization.');
    return false;
  }

  // Create backup unless skipped
  let backupPath = null;
  if (!skipBackup) {
    try {
      backupPath = await createBackup();
    } catch (error) {
      console.error('❌ Could not create backup. Aborting for safety.');
      return false;
    }
  }

  try {
    // Add indexes for frequently queried fields
    console.log('📊 Adding database indexes...');
    
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_services_category_id ON Service(categoryId);`,
      `CREATE INDEX IF NOT EXISTS idx_services_slug ON Service(slug);`,
      `CREATE INDEX IF NOT EXISTS idx_services_featured ON Service(featured);`,
      `CREATE INDEX IF NOT EXISTS idx_services_active ON Service(active);`,
      `CREATE INDEX IF NOT EXISTS idx_before_after_category_id ON BeforeAfter(categoryId);`,
      `CREATE INDEX IF NOT EXISTS idx_before_after_service_id ON BeforeAfter(serviceId);`,
      `CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON Testimonial(featured);`,
      `CREATE INDEX IF NOT EXISTS idx_testimonials_active ON Testimonial(active);`,
      `CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON HeroSlide(active);`,
      `CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON HeroSlide("order");`,
      `CREATE INDEX IF NOT EXISTS idx_categories_active ON Category(active);`,
      `CREATE INDEX IF NOT EXISTS idx_categories_order ON Category("order");`
    ];

    for (const query of indexQueries) {
      try {
        await prisma.$executeRawUnsafe(query);
      } catch (error) {
        console.warn(`⚠️  Index creation warning: ${error.message}`);
      }
    }
    
    console.log('✅ Database indexes processed successfully');

    // Analyze database statistics
    console.log('\n📈 Database statistics:');
    
    const serviceCount = await prisma.service.count();
    const categoryCount = await prisma.category.count();
    const beforeAfterCount = await prisma.beforeAfter.count();
    const testimonialCount = await prisma.testimonial.count();
    
    console.log(`- Services: ${serviceCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Before/After cases: ${beforeAfterCount}`);
    console.log(`- Testimonials: ${testimonialCount}`);

    // VACUUM database for SQLite optimization (optional)
    if (!skipVacuum) {
      console.log('\n🧹 Optimizing database storage...');
      console.log('⏳ This may take a moment and temporarily lock the database...');
      
      try {
        await prisma.$executeRaw`VACUUM;`;
        await prisma.$executeRaw`ANALYZE;`;
        console.log('✅ Database storage optimized');
      } catch (error) {
        console.error('⚠️  VACUUM failed (this is usually not critical):', error.message);
      }
    } else {
      console.log('\n⏭️  Skipping VACUUM operation');
    }

    // Clean up old backups (keep only last 3)
    if (backupPath) {
      console.log('\n🧹 Cleaning up old backups...');
      try {
        const backupFiles = fs.readdirSync('./')
          .filter(file => file.startsWith('dev.db.backup.'))
          .sort()
          .reverse();
        
        if (backupFiles.length > 3) {
          for (let i = 3; i < backupFiles.length; i++) {
            fs.unlinkSync(backupFiles[i]);
            console.log(`🗑️  Removed old backup: ${backupFiles[i]}`);
          }
        }
      } catch (error) {
        console.warn('⚠️  Could not clean up old backups:', error.message);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    
    // Restore backup if available
    if (backupPath && fs.existsSync(backupPath)) {
      console.log('🔄 Attempting to restore from backup...');
      try {
        fs.copyFileSync(backupPath, './dev.db');
        console.log('✅ Database restored from backup');
      } catch (restoreError) {
        console.error('❌ Backup restore failed:', restoreError);
      }
    }
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Performance monitoring queries
async function analyzeSlowQueries() {
  console.log('\n🔍 Analyzing query performance...');
  
  try {
    // Most accessed services
    const popularServices = await prisma.service.findMany({
      select: {
        slug: true,
        translations: {
          select: {
            title: true,
            language: true
          },
          where: {
            language: 'en'
          }
        }
      },
      where: {
        active: true
      },
      orderBy: {
        featured: 'desc'
      },
      take: 5
    });
    
    console.log('🔥 Most featured services:');
    popularServices.forEach(service => {
      const title = service.translations[0]?.title || service.slug;
      console.log(`  - ${title} (${service.slug})`);
    });

  } catch (error) {
    console.error('Query analysis failed:', error);
  }
}

async function main() {
  console.log('🚀 Vola Health Database Optimization Tool\n');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const options = {
    skipBackup: args.includes('--skip-backup'),
    skipVacuum: args.includes('--skip-vacuum'),
  };
  
  if (options.skipBackup) {
    console.log('⚠️  Running without backup (--skip-backup)');
  }
  if (options.skipVacuum) {
    console.log('⚠️  Skipping VACUUM operation (--skip-vacuum)');
  }
  
  const success = await optimizeDatabase(options);
  
  if (success) {
    await analyzeSlowQueries();
    
    console.log('\n💡 Performance Tips:');
    console.log('- Use SELECT only needed fields');
    console.log('- Implement pagination for large datasets');
    console.log('- Cache frequently accessed data');
    console.log('- Use database indexes for WHERE clauses');
    console.log('- Consider read replicas for heavy read operations');
    console.log('\n✅ Database optimization completed successfully!');
  } else {
    console.log('\n❌ Database optimization failed. Check logs above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeDatabase, analyzeSlowQueries }; 