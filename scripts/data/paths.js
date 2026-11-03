// Shared paths for the data-generation scripts (run them from any working directory).
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

module.exports = {
  ROOT,
  /** File inside public/data (the JSON datasets served to the browser). */
  dataFile: (...parts) => path.join(ROOT, 'public', 'data', ...parts),
  /** Scraped source material kept next to these scripts. */
  scrapedFile: (...parts) => path.join(__dirname, 'scraped', ...parts)
};
