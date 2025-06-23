const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '../public/service-images');
const outputDir = path.join(__dirname, '../public/optimized-images');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const optimizeImage = async (inputPath, outputPath, filename) => {
  try {
    const extension = path.extname(filename).toLowerCase();
    const nameWithoutExt = path.basename(filename, extension);
    
    // WebP version (smaller file size)
    await sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'cover',
        withoutEnlargement: true 
      })
      .webp({ 
        quality: 85,
        effort: 6 
      })
      .toFile(path.join(outputDir, `${nameWithoutExt}.webp`));
    
    // AVIF version (even smaller, modern browsers)
    await sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'cover',
        withoutEnlargement: true 
      })
      .avif({ 
        quality: 80,
        effort: 6 
      })
      .toFile(path.join(outputDir, `${nameWithoutExt}.avif`));
    
    // Fallback JPEG/PNG (optimized)
    const outputFormat = extension === '.png' ? 'png' : 'jpeg';
    await sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'cover',
        withoutEnlargement: true 
      })
      [outputFormat]({ 
        quality: outputFormat === 'jpeg' ? 85 : undefined,
        compressionLevel: outputFormat === 'png' ? 9 : undefined
      })
      .toFile(path.join(outputDir, `${nameWithoutExt}_optimized${extension}`));
    
    console.log(`✅ Optimized: ${filename}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message);
  }
};

const processImages = async () => {
  console.log('🚀 Starting image optimization...');
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    await optimizeImage(inputPath, outputDir, file);
  }
  
  console.log(`✨ Optimization complete! Processed ${imageFiles.length} images`);
  console.log(`📁 Optimized images saved to: ${outputDir}`);
};

processImages().catch(console.error); 