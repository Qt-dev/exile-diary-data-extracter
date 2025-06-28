import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Parser for Path of Exile stat_descriptions.txt file
 * Converts the specialized format into structured JSON
 */
const parseStatDescriptions = () => {
  // Get the directory name equivalent for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  // Path to the input file relative to this script
  const inputFilePath = path.join(__dirname, 'data/files/Metadata@StatDescriptions@stat_descriptions.txt');
  // Path to output file
  const outputFilePath = path.join(__dirname, 'output/temp/stat_descriptions.json');
  
  console.log(`Reading file: ${inputFilePath}`);
  
  // Read file content
  let fileContent;
  try {
    fileContent = fs.readFileSync(inputFilePath, 'utf16le');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    process.exit(1);
  }

  // Split the content into lines
  const lines = fileContent.split('\n');
  
  // Result object to store parsed data
  const result = {
    no_description: [],
    descriptions: []
  };
  
  // Current state during parsing
  let currentDescription = null;
  let currentLanguage = null;
  let isInDescriptionBlock = false;
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check for no_description lines
    if (line.startsWith('no_description')) {
      const parts = line.split(' ');
      if (parts.length > 1) {
        result.no_description.push(parts[1]);
      }
      continue;
    }
    
    // Check for description lines
    if (line === 'description') {
      isInDescriptionBlock = true;
      continue;
    }
    
    if (!isInDescriptionBlock) continue;
    
    // Check for stat ID line (starts with a number followed by identifier)
    if (/^\d+\s+\S+/.test(line)) {
      // If there was a previous description being built, add it to the result
      if (currentDescription) {
        result.descriptions.push(currentDescription);
      }
      
      // Create a new description
      const parts = line.split(' ');
      const id = parts[0];
      const statId = parts.slice(1).join(' ');
      
      currentDescription = {
        id: id,
        statId: statId,
        languages: {}
      };
      
      currentLanguage = "English";
      if (!currentDescription.languages[currentLanguage]) {
        currentDescription.languages[currentLanguage] = {
          format: null,
          descriptions: []
        };
      }
      continue;
    }
    
    // Check for language
    if (line.startsWith('lang')) {
      const langMatch = line.match(/lang\s+"([^"]+)"/);
      if (langMatch) {
        currentLanguage = langMatch[1];
        
        if (!currentDescription.languages[currentLanguage]) {
          currentDescription.languages[currentLanguage] = {
            format: null,
            descriptions: []
          };
        }
      }
      continue;
    }
    
    // Check for format number
    if (/^\d+$/.test(line) && currentDescription && currentLanguage) {
      currentDescription.languages[currentLanguage].format = line;
      continue;
    }
    
    // Check for description formats
    if (line.includes('|') && currentDescription && currentLanguage) {
      // Parse range and description
      const descMatch = line.match(/([^|]+)\|([^"]+)\s+"([^"]+)"/);
      
      if (descMatch) {
        const rangeStart = descMatch[1].trim();
        const rangeEnd = descMatch[2].trim();
        const descText = descMatch[3];
        
        currentDescription.languages[currentLanguage].descriptions.push({
          rangeStart,
          rangeEnd,
          text: descText,
          negate: line.includes('negate')
        });
      } else if (line.startsWith('#') && line.includes('"')) {
        // Handle special case for negate lines
        const negateMatch = line.match(/#\|([^"]+)\s+"([^"]+)"/);
        
        if (negateMatch) {
          const rangeVal = negateMatch[1].trim();
          const descText = negateMatch[2];
          
          currentDescription.languages[currentLanguage].descriptions.push({
            rangeStart: '#',
            rangeEnd: rangeVal,
            text: descText,
            negate: line.includes('negate')
          });
        }
      }
    }
  }
  
  // Add the last description if there is one
  if (currentDescription) {
    result.descriptions.push(currentDescription);
  }

  const filteredResult = {
    no_description: result.no_description,
    descriptions: result.descriptions.filter(desc => desc.statId.startsWith('map_'))
  };
  
  // Write the result to a JSON file
  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(filteredResult, null, 2));
    console.log(`Successfully wrote JSON to ${outputFilePath}`);
  } catch (error) {
    console.error(`Error writing JSON file: ${error.message}`);
    process.exit(1);
  }
};

export default parseStatDescriptions;
// // Run the parser
// parseStatDescriptions();
