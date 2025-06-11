require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createApi } = require('unsplash-js');
const nodeFetch = require('node-fetch');

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

const services = {
  dental: [
    { name: 'digital-smile-design', query: 'dental smile design' },
    { name: 'dental-veneers', query: 'dental veneers' },
    { name: 'hollywood-smile', query: 'perfect smile' },
    { name: 'gum-aesthetics', query: 'dental gums' },
    { name: 'teeth-whitening', query: 'white teeth' },
  ],
  facial: [
    { name: 'rhinoplasty', query: 'nose surgery' },
    { name: 'facelift', query: 'face lift surgery' },
    { name: 'eyelid-surgery', query: 'eyelid surgery' },
    { name: 'forehead-lifting', query: 'forehead lift' },
    { name: 'neck-lift', query: 'neck lift surgery' },
    { name: 'botox', query: 'botox injection' },
  ],
  body: [
    { name: 'bbl', query: 'buttock lift' },
    { name: 'breast-augmentation', query: 'breast surgery' },
    { name: 'thigh-lift', query: 'thigh lift' },
    { name: 'tummy-tuck', query: 'tummy tuck' },
    { name: 'six-pack-surgery', query: 'six pack abs' },
  ],
};

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response
          .pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
}

async function generateImages() {
  for (const [category, categoryServices] of Object.entries(services)) {
    for (const service of categoryServices) {
      const dir = path.join('public', 'images', 'services', category, service.name);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      try {
        // Get 4 images for each service (3 regular + 1 thumbnail)
        const result = await unsplash.search.getPhotos({
          query: service.query,
          perPage: 4,
          orientation: 'landscape',
        });

        if (result.errors) {
          console.log('Error occurred: ', result.errors[0]);
          continue;
        }

        const { response } = result;
        
        // Download regular images
        for (let i = 0; i < 3; i++) {
          if (response.results[i]) {
            const url = response.results[i].urls.regular;
            const filepath = path.join(dir, `${i + 1}.jpg`);
            await downloadImage(url, filepath);
            console.log(`Downloaded: ${filepath}`);
          }
        }

        // Download thumbnail
        if (response.results[3]) {
          const url = response.results[3].urls.small;
          const filepath = path.join(dir, 'thumb.jpg');
          await downloadImage(url, filepath);
          console.log(`Downloaded: ${filepath}`);
        }
      } catch (error) {
        console.error(`Error processing ${category}/${service.name}:`, error);
      }
    }
  }
}

generateImages().catch(console.error); 