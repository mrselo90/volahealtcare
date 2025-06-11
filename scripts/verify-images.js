const fs = require('fs');
const path = require('path');
const { services } = require('../src/data/services.ts');

function verifyImages() {
  const missingImages = [];
  const publicDir = path.join(process.cwd(), 'public');

  services.forEach(category => {
    category.services.forEach(service => {
      // Check thumbnail
      const thumbnailPath = path.join(publicDir, service.thumbnail);
      if (!fs.existsSync(thumbnailPath)) {
        missingImages.push(service.thumbnail);
      }

      // Check service images
      service.images.forEach(imagePath => {
        const fullPath = path.join(publicDir, imagePath);
        if (!fs.existsSync(fullPath)) {
          missingImages.push(imagePath);
        }
      });
    });
  });

  if (missingImages.length > 0) {
    console.log('Missing images:');
    missingImages.forEach(img => console.log(` - ${img}`));
    process.exit(1);
  } else {
    console.log('All images are present!');
  }
}

verifyImages(); 