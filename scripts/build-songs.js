import fs from 'fs';
import path from 'path';

const SONGS_DIR = 'songs';
const OUTPUT_FILE = 'src/data/songs.ts';

function parseFrontMatter(content) {
  const lines = content.split('\n');
  
  if (lines[0] !== '---') {
    throw new Error('No front matter found - file must start with "---"');
  }
  
  const frontMatter = {};
  let i = 1;
  
  while (i < lines.length && lines[i] !== '---') {
    const line = lines[i].trim();
    if (line) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        throw new Error(`Invalid front matter line: ${line}`);
      }
      
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      
      // Simple type conversion
      if (value === 'true' || value === 'false') {
        frontMatter[key] = value === 'true';
      } else if (!isNaN(value) && value !== '') {
        frontMatter[key] = Number(value);
      } else {
        frontMatter[key] = value;
      }
    }
    i++;
  }
  
  if (i >= lines.length) {
    throw new Error('Front matter not closed with "---"');
  }
  
  const markdownContent = lines.slice(i + 1).join('\n').trim();
  
  return { frontMatter, content: markdownContent };
}

function buildSongs() {
  try {
    console.log('Building songs from markdown files...');
    
    const files = fs.readdirSync(SONGS_DIR)
      .filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      throw new Error(`No markdown files found in ${SONGS_DIR} directory`);
    }
    
    const songs = [];
    
    for (const file of files) {
      const filePath = path.join(SONGS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const { frontMatter, content: markdownContent } = parseFrontMatter(content);
        
        if (!frontMatter.id) {
          throw new Error('Missing required "id" field in front matter');
        }
        
        if (!frontMatter.title) {
          throw new Error('Missing required "title" field in front matter');
        }
        
        const song = {
          id: frontMatter.id,
          title: frontMatter.title,
          content: markdownContent
        };
        
        if (frontMatter.defaultTranspose !== undefined) {
          song.defaultTranspose = frontMatter.defaultTranspose;
        }
        
        songs.push(song);
        console.log(`✓ Processed: ${file} -> ${song.title}`);
        
      } catch (error) {
        throw new Error(`Error parsing ${file}: ${error.message}`);
      }
    }
    
    // Generate the TypeScript file
    const output = `import type { Song } from '../types/Song';

export const songs: Song[] = ${JSON.stringify(songs, null, 2)};
`;
    
    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`✓ Generated ${OUTPUT_FILE} with ${songs.length} songs`);
    
  } catch (error) {
    console.error('❌ Build failed:');
    console.error(error.message);
    process.exit(1);
  }
}

buildSongs();