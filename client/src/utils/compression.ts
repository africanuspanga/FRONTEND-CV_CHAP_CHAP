/**
 * Simple string compression/decompression utilities for localStorage
 * This provides a way to store more data in localStorage by compressing strings
 */

/**
 * Very simple run-length encoding (RLE) for strings
 * Compresses sequences of identical characters
 */
export function compressString(input: string): string {
  if (!input || input.length < 100) return input; // Don't compress short strings
  
  let result = '';
  let count = 1;
  let prevChar = input[0];
  
  for (let i = 1; i < input.length; i++) {
    const char = input[i];
    
    if (char === prevChar) {
      count++;
    } else {
      // If run length is 4 or more, use compression
      if (count >= 4) {
        result += `${prevChar}#${count}#`;
      } else {
        // Otherwise just append the actual characters
        result += prevChar.repeat(count);
      }
      
      prevChar = char;
      count = 1;
    }
  }
  
  // Add the last character run
  if (count >= 4) {
    result += `${prevChar}#${count}#`;
  } else {
    result += prevChar.repeat(count);
  }
  
  // Only return compressed result if it's actually smaller
  return result.length < input.length ? result : input;
}

/**
 * Decompress a string compressed with compressString
 */
export function decompressString(input: string): string {
  if (!input || !input.includes('#')) return input; // Not compressed
  
  const regex = /([^#])#(\d+)#/g;
  return input.replace(regex, (match, char, count) => {
    return char.repeat(parseInt(count, 10));
  });
}

/**
 * LZW-inspired compression algorithm
 * More complex but better compression ratio than RLE
 */
export function lzCompress(input: string): string {
  if (!input || input.length < 200) return input; // Don't compress short strings
  
  const dictionary: Record<string, number> = {};
  const result: string[] = [];
  let dictSize = 256;
  
  // Initialize dictionary with ASCII characters
  for (let i = 0; i < 256; i++) {
    dictionary[String.fromCharCode(i)] = i;
  }
  
  let currentPhrase = '';
  
  for (let i = 0; i < input.length; i++) {
    const currentChar = input[i];
    const combinedPhrase = currentPhrase + currentChar;
    
    if (dictionary[combinedPhrase] !== undefined) {
      currentPhrase = combinedPhrase;
    } else {
      result.push(String.fromCharCode(dictionary[currentPhrase]));
      dictionary[combinedPhrase] = dictSize++;
      currentPhrase = currentChar;
      
      // Reset dictionary if it gets too large
      if (dictSize > 65536) {
        dictSize = 256;
        for (let j = 0; j < 256; j++) {
          dictionary[String.fromCharCode(j)] = j;
        }
      }
    }
  }
  
  // Output the last phrase
  if (currentPhrase !== '') {
    result.push(String.fromCharCode(dictionary[currentPhrase]));
  }
  
  const compressed = result.join('');
  
  // Add a marker so we know it's LZ compressed
  const markedCompressed = `LZ_COMPRESSED:${compressed}`;
  
  // Only return compressed if it's smaller
  return markedCompressed.length < input.length ? markedCompressed : input;
}

/**
 * Decompress a string compressed with lzCompress
 */
export function lzDecompress(input: string): string {
  if (!input || !input.startsWith('LZ_COMPRESSED:')) return input;
  
  // Remove the marker
  const compressed = input.substring('LZ_COMPRESSED:'.length);
  
  const dictionary: Record<number, string> = {};
  let dictSize = 256;
  
  // Initialize dictionary with ASCII characters
  for (let i = 0; i < 256; i++) {
    dictionary[i] = String.fromCharCode(i);
  }
  
  const result: string[] = [];
  let previousChar = compressed[0];
  result.push(previousChar);
  
  for (let i = 1; i < compressed.length; i++) {
    const currentChar = compressed[i];
    const currentCode = currentChar.charCodeAt(0);
    
    let phrase;
    if (dictionary[currentCode] !== undefined) {
      phrase = dictionary[currentCode];
    } else if (currentCode === dictSize) {
      phrase = previousChar + previousChar[0];
    } else {
      throw new Error('Invalid compressed data');
    }
    
    result.push(phrase);
    
    // Add to dictionary
    dictionary[dictSize++] = previousChar + phrase[0];
    previousChar = phrase;
    
    // Reset dictionary if it gets too large
    if (dictSize > 65536) {
      dictSize = 256;
      for (let j = 0; j < 256; j++) {
        dictionary[j] = String.fromCharCode(j);
      }
    }
  }
  
  return result.join('');
}

/**
 * Compress an object by converting to string, compressing, and encoding
 */
export function compressObject(obj: any): string {
  try {
    const jsonString = JSON.stringify(obj);
    const compressed = lzCompress(jsonString);
    return btoa(compressed); // Base64 encode to handle binary data
  } catch (error) {
    console.error('Error compressing object:', error);
    return JSON.stringify(obj); // Fallback to uncompressed
  }
}

/**
 * Decompress a string created by compressObject back into an object
 */
export function decompressObject(compressed: string): any {
  try {
    const decoded = atob(compressed); // Base64 decode
    const decompressed = lzDecompress(decoded);
    return JSON.parse(decompressed);
  } catch (error) {
    console.error('Error decompressing object:', error);
    // Try parsing directly as a fallback
    try {
      return JSON.parse(compressed);
    } catch {
      return null;
    }
  }
}

/**
 * Split a string into chunks of specified size
 */
export function splitIntoChunks(input: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < input.length; i += chunkSize) {
    chunks.push(input.substring(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Join chunks back into a single string
 */
export function joinChunks(chunks: string[]): string {
  return chunks.join('');
}
