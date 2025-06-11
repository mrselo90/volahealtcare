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

function checkImages() {
  const missingFiles = [];
  const baseDir = path.join(process.cwd(), 'public', 'images', 'services');

  Object.entries(serviceStructure).forEach(([category, services]) => {
    services.forEach(service => {
      const serviceDir = path.join(baseDir, category, service);
      
      // Check if service directory exists
      if (!fs.existsSync(serviceDir)) {
        missingFiles.push(`Directory: ${path.join('public/images/services', category, service)}`);
        return;
      }

      // Check for required files
      const requiredFiles = ['1.svg', '2.svg', '3.svg', 'thumb.svg'];
      requiredFiles.forEach(file => {
        const filePath = path.join(serviceDir, file);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(`File: ${path.join('public/images/services', category, service, file)}`);
        }
      });
    });
  });

  if (missingFiles.length > 0) {
    console.log('Missing files:');
    missingFiles.forEach(file => console.log(` - ${file}`));
    process.exit(1);
  } else {
    console.log('All required files are present!');
  }
}

checkImages(); 