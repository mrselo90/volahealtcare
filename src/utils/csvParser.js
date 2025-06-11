import fs from 'fs/promises';

/**
 * Parses the CSV file and extracts service information
 * @returns {Promise<Object>} Map of services with their details and images
 */
export async function parseServiceData() {
  const csvContent = await fs.readFile('Dental+Treatments+Detail.csv', 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Skip header
  
  const serviceMap = {};
  
  for (const line of lines) {
    // Skip empty lines
    if (!line.trim()) continue;
    
    // Split by commas, but preserve commas within quotes
    const parts = line.match(/("([^"]*)"|([^,]+))(,|$)/g);
    if (!parts) continue;
    
    // Extract and clean the values
    const values = parts.map(part => {
      // Remove trailing comma and whitespace
      part = part.replace(/,$/, '').trim();
      // Remove surrounding quotes and unescape inner quotes
      if (part.startsWith('"') && part.endsWith('"')) {
        part = part.slice(1, -1).replace(/""/g, '"');
      }
      return part;
    });
    
    // Extract image URL from the values
    let imageUrl = '';
    for (const value of values) {
      if (value.includes('http://') || value.includes('https://') || value.startsWith('/')) {
        imageUrl = value;
        break;
      }
    }
    
    // Find the title (should be in the first column)
    const title = values[0];
    
    // Skip if we don't have both title and image
    if (!title || !imageUrl) continue;
    
    // Determine service category and clean title
    let category = 'dental';
    let cleanTitle = title.replace(/\s*Detail\s*$/i, '').trim();
    const lowerTitle = cleanTitle.toLowerCase();
    
    // Facial treatments
    if (lowerTitle.includes('face') || 
        lowerTitle.includes('lift') ||
        lowerTitle.includes('botox') ||
        lowerTitle.includes('rhinoplasty') ||
        lowerTitle.includes('eyelid') ||
        lowerTitle.includes('bichectomy') ||
        lowerTitle.includes('neck') ||
        lowerTitle.includes('brow') ||
        lowerTitle.includes('facial')) {
      category = 'facial';
    } 
    // Body treatments
    else if (lowerTitle.includes('breast') || 
             lowerTitle.includes('body') ||
             lowerTitle.includes('bbl') ||
             lowerTitle.includes('tummy') ||
             lowerTitle.includes('thigh') ||
             lowerTitle.includes('arm') ||
             lowerTitle.includes('liposuction') ||
             lowerTitle.includes('pack') ||
             lowerTitle.includes('gynecomastia')) {
      category = 'body';
    }
    
    // Create a URL-friendly slug
    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    // Find the short description (usually the second column)
    const shortDesc = values[1] || '';
    
    // Find the long description (usually the third column)
    const longDesc = values[2] || '';
    
    // Create directory path
    const dirPath = `${category}/${slug}`;
    
    // Create the directory if it doesn't exist
    const fullPath = `public/images/services/${dirPath}`;
    await fs.mkdir(fullPath, { recursive: true });
    
    serviceMap[slug] = {
      title: cleanTitle,
      shortDesc,
      longDesc,
      imageUrl,
      category,
      path: dirPath
    };
  }
  
  return serviceMap;
} 