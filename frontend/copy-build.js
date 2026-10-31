import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticDir = path.resolve(__dirname, '../src/main/resources/static');
const indexPath = path.join(staticDir, 'index.html');

if (fs.existsSync(indexPath)) {
  console.log(`[build-check] Successfully generated production bundle into: ${staticDir}`);
} else {
  console.warn(`[build-check] Warning: index.html not found in ${staticDir}`);
}
