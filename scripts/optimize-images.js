const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  quality: {
    webp: 80,
    avif: 75,
    jpeg: 85
  },
  maxWidth: 1920,
  directories: [
    'public/uploads',
    'public/service-images',
    'public/images/before-after',
    'public/images/services'
  ]
};

async function optimizeImage(inputPath, outputDir) {
  try {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const ext = path.extname(inputPath).toLowerCase();
    
    // Skip if not an image
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      return;
    }
    
    // Read image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`Processing: ${filename}${ext} (${metadata.width}x${metadata.height}, ${(metadata.size / 1024).toFixed(1)}KB)`);
    
    // Resize if too large
    let pipeline = sharp(inputPath);
    if (metadata.width > config.maxWidth) {
      pipeline = pipeline.resize(config.maxWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Generate WebP version
    const webpPath = path.join(outputDir, `${filename}.webp`);
    await pipeline
      .clone()
      .webp({ quality: config.quality.webp })
      .toFile(webpPath);
    
    // Generate AVIF version
    const avifPath = path.join(outputDir, `${filename}.avif`);
    await pipeline
      .clone()
      .avif({ quality: config.quality.avif })
      .toFile(avifPath);
    
    // Generate optimized JPEG/PNG fallback
    const optimizedPath = path.join(outputDir, `${filename}_optimized${ext}`);
    if (ext === '.png') {
      await pipeline
        .clone()
        .png({ compressionLevel: 9 })
        .toFile(optimizedPath);
    } else {
      await pipeline  
        .clone()
        .jpeg({ quality: config.quality.jpeg, progressive: true })
        .toFile(optimizedPath);
    }
    
    // Get file sizes for comparison
    const originalSize = (await fs.promises.stat(inputPath)).size;
    const webpSize = (await fs.promises.stat(webpPath)).size;
    const avifSize = (await fs.promises.stat(avifPath)).size;
    const optimizedSize = (await fs.promises.stat(optimizedPath)).size;
    
    console.log(`  ✓ Original: ${(originalSize / 1024).toFixed(1)}KB`);
    console.log(`  ✓ WebP: ${(webpSize / 1024).toFixed(1)}KB (${((1 - webpSize/originalSize) * 100).toFixed(1)}% smaller)`);
    console.log(`  ✓ AVIF: ${(avifSize / 1024).toFixed(1)}KB (${((1 - avifSize/originalSize) * 100).toFixed(1)}% smaller)`);
    console.log(`  ✓ Optimized: ${(optimizedSize / 1024).toFixed(1)}KB (${((1 - optimizedSize/originalSize) * 100).toFixed(1)}% smaller)`);
    
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

async function processDirectory(dirPath) {
  try {
    const files = await fs.promises.readdir(dirPath);
    
    // Create optimized subdirectory
    const optimizedDir = path.join(dirPath, 'optimized');
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true });
    }
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.promises.stat(filePath);
      
      if (stat.isDirectory() && file !== 'optimized') {
        // Recursively process subdirectories
        await processDirectory(filePath);
      } else if (stat.isFile()) {
        await optimizeImage(filePath, optimizedDir);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  // Install Sharp if not available
  try {
    require('sharp');
  } catch (error) {
    console.log('Installing Sharp...');
    const { execSync } = require('child_process');
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('Sharp installed successfully!\n');
  }
  
  for (const dir of config.directories) {
    if (fs.existsSync(dir)) {
      console.log(`\n📁 Processing directory: ${dir}`);
      await processDirectory(dir);
    } else {
      console.log(`⚠️  Directory not found: ${dir}`);
    }
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log('\n💡 Usage recommendations:');
  console.log('   - Use WebP images for modern browsers');
  console.log('   - Use AVIF for even better compression');
  console.log('   - Keep optimized versions as fallbacks');
  console.log('   - Update your Next.js Image components to use the optimized versions');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, processDirectory }; 