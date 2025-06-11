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

function createSvg(width, height, text) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
      ${text}
    </text>
  </svg>`;
}

function createPlaceholderImages() {
  const baseDir = path.join(process.cwd(), 'public', 'images', 'services');

  // Create category directories
  Object.entries(serviceStructure).forEach(([category, services]) => {
    services.forEach(service => {
      const serviceDir = path.join(baseDir, category, service);
      fs.mkdirSync(serviceDir, { recursive: true });

      // Create 3 main images
      for (let i = 1; i <= 3; i++) {
        const filepath = path.join(serviceDir, `${i}.svg`);
        const svg = createSvg(800, 600, `${service} ${i}`);
        fs.writeFileSync(filepath, svg);
        console.log(`Created ${filepath}`);
      }

      // Create thumbnail
      const thumbPath = path.join(serviceDir, 'thumb.svg');
      const thumbSvg = createSvg(400, 300, service);
      fs.writeFileSync(thumbPath, thumbSvg);
      console.log(`Created ${thumbPath}`);
    });
  });
}

createPlaceholderImages(); 