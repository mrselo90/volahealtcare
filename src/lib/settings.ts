import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'src/data/settings.json');

export function getSettings() {
  const data = fs.readFileSync(settingsPath, 'utf-8');
  return JSON.parse(data);
}
