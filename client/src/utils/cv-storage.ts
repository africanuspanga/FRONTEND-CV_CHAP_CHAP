/**
 * CV Storage utility
 * Uses both localStorage and IndexedDB to store large CV form data
 * With compression fallback for environments where IndexedDB is not available
 */

import { compressObject, decompressObject, splitIntoChunks, joinChunks } from './compression';

// DB Configuration
const DB_NAME = 'cvChapChapDB';
const STORE_NAME = 'cvFormData';
const DB_VERSION = 1;
const CV_DATA_KEY = 'cv-form-data';
const CV_STEP_KEY = 'cv-form-step';

// Helper to open the database connection
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Check for IndexedDB support
    if (!('indexedDB' in window)) {
      reject(new Error('This browser doesn\'t support IndexedDB'));
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error('Failed to open database'));
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Constants for chunked compression storage
const COMPRESSED_PREFIX = 'cv-compressed-';
const CHUNK_SIZE = 1024 * 200; // 200KB chunks
const CHUNK_COUNT_KEY = 'cv-compressed-chunks';

// Save compressed data in chunks to localStorage
const saveCompressedData = (formData: any): void => {
  console.log('Using compressed storage fallback...');
  try {
    // First clean up any existing compressed chunks
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(COMPRESSED_PREFIX)) {
        localStorage.removeItem(key);
        i--; // Adjust index since we're removing items
      }
    }
    
    // Compress the data
    const compressed = compressObject(formData);
    console.log(`Original size: ${JSON.stringify(formData).length}, Compressed size: ${compressed.length}`);
    
    // Split into chunks if still too large
    if (compressed.length > CHUNK_SIZE) {
      const chunks = splitIntoChunks(compressed, CHUNK_SIZE);
      console.log(`Split compressed data into ${chunks.length} chunks`);
      
      // Store each chunk with an index
      chunks.forEach((chunk, index) => {
        localStorage.setItem(`${COMPRESSED_PREFIX}${index}`, chunk);
      });
      
      // Store the number of chunks
      localStorage.setItem(CHUNK_COUNT_KEY, chunks.length.toString());
      localStorage.setItem('using-compression', 'true');
    } else {
      // Store directly if small enough
      localStorage.setItem(`${COMPRESSED_PREFIX}0`, compressed);
      localStorage.setItem(CHUNK_COUNT_KEY, '1');
      localStorage.setItem('using-compression', 'true');
    }
    
    console.log('CV data saved using compression');
  } catch (e) {
    console.error('Error in compression fallback:', e);
    throw e;
  }
};

// Load compressed data from localStorage chunks
const loadCompressedData = (): any => {
  try {
    const chunkCountStr = localStorage.getItem(CHUNK_COUNT_KEY);
    if (!chunkCountStr) {
      return null;
    }
    
    const chunkCount = parseInt(chunkCountStr, 10);
    const chunks: string[] = [];
    
    // Gather all chunks
    for (let i = 0; i < chunkCount; i++) {
      const chunk = localStorage.getItem(`${COMPRESSED_PREFIX}${i}`);
      if (!chunk) {
        console.error(`Missing chunk ${i} of ${chunkCount}`);
        return null;
      }
      chunks.push(chunk);
    }
    
    // Join and decompress
    const compressed = joinChunks(chunks);
    return decompressObject(compressed);
  } catch (e) {
    console.error('Error loading compressed data:', e);
    return null;
  }
};

// Save CV data to IndexedDB with compression fallback
export const saveFormData = async (formData: any): Promise<void> => {
  try {
    console.log('Attempting to save CV data...');
    // First try to save in localStorage as a convenience
    const formDataStr = JSON.stringify(formData);
    console.log(`Data size: ${formDataStr.length} bytes`);
    
    if (formDataStr.length < 200000) { // ~200KB (safe for most browsers)
      try {
        localStorage.setItem(CV_DATA_KEY, formDataStr);
        localStorage.removeItem('using-indexeddb');
        localStorage.removeItem('using-compression');
        console.log('CV data stored in localStorage');
        return;
      } catch (localStorageError) {
        console.error('Error storing in localStorage:', localStorageError);
        // Continue to other storage methods
      }
    }
    
    // Try IndexedDB if available
    if (isIndexedDBAvailable()) {
      try {
        // Mark that we're using IndexedDB instead of localStorage
        localStorage.setItem('using-indexeddb', 'true');
        localStorage.removeItem('using-compression');
        console.log('Attempting to use IndexedDB storage...');
        
        // Save to IndexedDB
        const db = await openDB();
        console.log('IndexedDB opened successfully');
        
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        console.log('Transaction created');
        
        const store = transaction.objectStore(STORE_NAME);
        console.log('Object store accessed');
        
        // Store the CV data
        const dataToStore = {
          id: CV_DATA_KEY,
          data: formData,
          timestamp: Date.now()
        };
        console.log('Storing data with ID:', CV_DATA_KEY);
        
        const request = store.put(dataToStore);
        
        await new Promise<void>((resolve, reject) => {
          request.onsuccess = () => {
            console.log('CV data stored in IndexedDB successfully');
            resolve();
          };
          
          request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            console.error('IndexedDB save error:', error);
            
            if (error) {
              console.error('Error name:', error.name);
              console.error('Error message:', error.message);
            }
            reject(new Error(`Failed to save to IndexedDB: ${error?.message || 'Unknown error'}`));
          };
          
          transaction.oncomplete = () => {
            console.log('Transaction completed');
            db.close();
          };
          
          transaction.onerror = (event) => {
            const error = transaction.error;
            console.error('Transaction error:', error);
            reject(new Error(`IndexedDB transaction error: ${error?.message || 'Unknown error'}`));
          };
          
          transaction.onabort = (event) => {
            const error = transaction.error;
            console.error('Transaction aborted:', error);
            reject(new Error(`IndexedDB transaction aborted: ${error?.message || 'Unknown error'}`));
          };
        });
        
        // If we get here, IndexedDB storage was successful
        return;
      } catch (indexedDBError) {
        console.error('Error using IndexedDB, attempting compression fallback:', indexedDBError);
        // Continue to compression fallback
      }
    } else {
      console.warn('IndexedDB not available, using compression fallback');
    }
    
    // If IndexedDB is not available or failed, use compression fallback
    // First check if we're in private browsing mode
    const isPrivate = await isLikelyPrivateBrowsing();
    if (isPrivate) {
      console.warn('Likely in private browsing mode, storage may be limited');
    }
    
    // Use compression as a last resort
    saveCompressedData(formData);
    localStorage.removeItem('using-indexeddb');
    
  } catch (error) {
    // Detailed error logging
    console.error('Error saving CV data:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Try compression as an absolute last resort with more aggressive settings
    try {
      console.warn('All storage methods failed, trying last resort compression...');
      saveCompressedData(formData);
    } catch (compressionError) {
      console.error('Final fallback compression also failed:', compressionError);
      throw error; // Re-throw the original error
    }
  }
};

// Check if IndexedDB is available in this browser environment
export const isIndexedDBAvailable = (): boolean => {
  try {
    return !!window.indexedDB;
  } catch (e) {
    console.error('Error checking IndexedDB availability:', e);
    return false;
  }
};

// Directly check if private browsing mode is likely enabled
// This is a heuristic; different browsers may behave differently
export const isLikelyPrivateBrowsing = async (): Promise<boolean> => {
  try {
    if (!isIndexedDBAvailable()) return true;
    
    // Try to write to localStorage as a test
    const testKey = '__private_browsing_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    
    // Also test if we can open IndexedDB
    try {
      const request = indexedDB.open('__test_db__');
      await new Promise<void>((resolve, reject) => {
        request.onerror = () => {
          console.log('Likely in private browsing mode (IndexedDB test failed)');
          reject(new Error('IndexedDB test failed'));
        };
        request.onsuccess = () => {
          request.result.close();
          indexedDB.deleteDatabase('__test_db__');
          resolve();
        };
      });
      return false;
    } catch (e) {
      console.log('IndexedDB test failed, likely in private browsing mode');
      return true;
    }
  } catch (e) {
    console.log('localStorage test failed, likely in private browsing mode');
    return true;
  }
};

// Load CV data from storage (using all available methods)
export const loadFormData = async (): Promise<any | null> => {
  console.log('Attempting to load CV form data...');
  
  try {
    // First try localStorage for simplicity and speed
    try {
      const savedData = localStorage.getItem(CV_DATA_KEY);
      if (savedData) {
        console.log('CV data found in localStorage');
        const parsed = JSON.parse(savedData);
        return parsed;
      }
    } catch (localStorageError) {
      console.error('Error loading from localStorage:', localStorageError);
    }
    
    // Check if using compression
    const usingCompression = localStorage.getItem('using-compression') === 'true';
    if (usingCompression) {
      console.log('Attempting to load compressed data...');
      const compressedData = loadCompressedData();
      if (compressedData) {
        console.log('Successfully loaded compressed data');
        return compressedData;
      }
    }
    
    // Check if IndexedDB is available
    if (!isIndexedDBAvailable()) {
      console.warn('IndexedDB is not available in this browser');
      return null;
    }
    
    const isPrivateBrowsing = await isLikelyPrivateBrowsing();
    if (isPrivateBrowsing) {
      console.warn('Likely in private browsing mode, IndexedDB may be limited');
    }
    
    // Check if we're using IndexedDB
    const usingIndexedDB = localStorage.getItem('using-indexeddb') === 'true';
    if (!usingIndexedDB) {
      console.log('Not using IndexedDB according to flag');
      return null;
    }
    
    console.log('Attempting to load from IndexedDB...');
    try {
      // Try IndexedDB
      const db = await openDB();
      console.log('IndexedDB opened successfully for reading');
      
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      
      return await new Promise((resolve, reject) => {
        console.log('Reading data with ID:', CV_DATA_KEY);
        const request = store.get(CV_DATA_KEY);
        
        request.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result;
          if (result) {
            console.log('CV data loaded from IndexedDB');
            resolve(result.data);
          } else {
            console.log('No data found in IndexedDB');
            resolve(null);
          }
        };
        
        request.onerror = (event) => {
          const error = (event.target as IDBRequest).error;
          console.error('IndexedDB load error:', error);
          if (error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
          }
          reject(new Error(`Failed to load CV data from IndexedDB: ${error?.message || 'Unknown error'}`));
        };
        
        transaction.oncomplete = () => {
          console.log('Load transaction completed');
          db.close();
        };
        
        transaction.onerror = (event) => {
          const error = transaction.error;
          console.error('Load transaction error:', error);
          reject(new Error(`IndexedDB load transaction error: ${error?.message || 'Unknown error'}`));
        };
      });
    } catch (indexedDBError) {
      console.error('Error loading from IndexedDB:', indexedDBError);
      // Try compressed data as a last resort in case the flag was not correctly set
      return loadCompressedData();
    }
  } catch (error) {
    console.error('Error loading CV data:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Last resort: Try to load compressed data even if we don't think we're using it
    try {
      return loadCompressedData();
    } catch (e) {
      console.error('Failed to load data from any source');
      return null;
    }
  }
};

// Save the current step to localStorage (small enough to use localStorage)
export const saveStep = (step: number): void => {
  try {
    localStorage.setItem(CV_STEP_KEY, step.toString());
  } catch (error) {
    console.error('Error saving step:', error);
  }
};

// Load the current step from localStorage
export const loadStep = (): number | null => {
  try {
    const savedStep = localStorage.getItem(CV_STEP_KEY);
    return savedStep ? parseInt(savedStep, 10) : null;
  } catch (error) {
    console.error('Error loading step:', error);
    return null;
  }
};

// Clear all CV data from all storage mechanisms
export const clearFormData = async (): Promise<void> => {
  console.log('Clearing all CV form data...');
  try {
    // Clear from localStorage
    localStorage.removeItem(CV_DATA_KEY);
    localStorage.removeItem(CV_STEP_KEY);
    localStorage.removeItem('using-indexeddb');
    localStorage.removeItem('using-compression');
    localStorage.removeItem(CHUNK_COUNT_KEY);
    
    // Clear compressed chunks if any
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(COMPRESSED_PREFIX)) {
        localStorage.removeItem(key);
        i--; // Adjust index since we're removing items
      }
    }
    
    // Attempt to clear from IndexedDB if available
    if (isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.delete(CV_DATA_KEY);
          
          request.onsuccess = () => {
            console.log('CV data cleared from IndexedDB');
            resolve();
          };
          
          request.onerror = (event) => {
            console.error('IndexedDB clear error:', event);
            reject(new Error('Failed to clear CV data from IndexedDB'));
          };
          
          transaction.oncomplete = () => {
            db.close();
          };
        });
      } catch (indexedDBError) {
        console.error('Error clearing IndexedDB data:', indexedDBError);
        // Continue anyway since we already cleared localStorage
      }
    }
    
    console.log('All CV form data cleared successfully');
  } catch (error) {
    console.error('Error clearing CV data:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Make a more aggressive attempt to clear everything
    try {
      // Try to clear any localStorage items related to CV data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('cv-') || key.includes('CV'))) {
          localStorage.removeItem(key);
          i--; // Adjust index
        }
      }
    } catch (e) {
      console.error('Final fallback clearing also failed:', e);
    }
  }
};
