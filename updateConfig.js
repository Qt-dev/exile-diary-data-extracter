import fs  from 'fs/promises';
import path from 'path';

fetch('https://raw.githubusercontent.com/poe-tool-dev/latest-patch-version/main/latest.txt')
  .then(response => response.text())
  .then(async latestPatch => {
    // Process the fetched data
    const configPath = path.resolve('./data/config.json');
    const config = await fs.readFile(configPath, 'utf-8');
    const updatedConfig = config.replace(/"patch": ".*?"/, `"patch": "${latestPatch}"`);
    await fs.writeFile(configPath, updatedConfig);
    console.log('Latest patch updated:', latestPatch);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });