const fs = require('fs');
const path = require('path');

const serviceStructure = {
  dental: [
    'digital-smile-design',
    'dental-veneers',
    'hollywood-smile',
    'gum-aesthetics',
    'teeth-whitening'
  ],
  facial: [
    'rhinoplasty',
    'facelift',
    'eyelid-surgery',
    'forehead-lifting',
    'neck-lift',
    'botox'
  ],
  body: [
    'bbl',
    'breast-augmentation',
    'thigh-lift',
    'tummy-tuck',
    'six-pack-surgery'
  ]
};

function moveDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`Source directory doesn't exist: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true });
    }
    fs.renameSync(srcPath, destPath);
  });
}

function organizeImages() {
  const baseDir = path.join(process.cwd(), 'public', 'images', 'services');
  
  // First, ensure category directories exist
  Object.keys(serviceStructure).forEach(category => {
    const categoryPath = path.join(baseDir, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
  });

  // Move services to correct categories
  Object.entries(serviceStructure).forEach(([category, services]) => {
    services.forEach(service => {
      const srcPath = path.join(baseDir, 'dental', service); // All services are currently in dental
      const destPath = path.join(baseDir, category, service);
      
      if (fs.existsSync(srcPath)) {
        console.log(`Moving ${service} to ${category}`);
        moveDirectory(srcPath, destPath);
      } else {
        console.log(`Service directory not found: ${srcPath}`);
      }
    });
  });

  // Clean up empty directories
  fs.readdirSync(baseDir).forEach(category => {
    const categoryPath = path.join(baseDir, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const contents = fs.readdirSync(categoryPath);
      if (contents.length === 0) {
        fs.rmdirSync(categoryPath);
      }
    }
  });

  console.log('Directory organization complete!');
}

organizeImages(); 