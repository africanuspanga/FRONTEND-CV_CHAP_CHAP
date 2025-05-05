/**
 * CV Storage utility
 * Uses both localStorage and IndexedDB to store large CV form data
 */

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

// Save CV data to IndexedDB
export const saveFormData = async (formData: any): Promise<void> => {
  try {
    // First try to save in localStorage as a convenience
    const formDataStr = JSON.stringify(formData);
    if (formDataStr.length < 200000) { // ~200KB (safe for most browsers)
      localStorage.setItem(CV_DATA_KEY, formDataStr);
      localStorage.removeItem('using-indexeddb');
      return;
    }
    
    // Mark that we're using IndexedDB instead of localStorage
    localStorage.setItem('using-indexeddb', 'true');
    
    // Save to IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Store the CV data
    const request = store.put({
      id: CV_DATA_KEY,
      data: formData,
      timestamp: Date.now()
    });
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('CV data stored in IndexedDB');
        resolve();
      };
      
      request.onerror = (event) => {
        console.error('IndexedDB save error:', event);
        reject(new Error('Failed to save CV data to IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error saving CV data:', error);
    throw error;
  }
};

// Load CV data from storage (either localStorage or IndexedDB)
export const loadFormData = async (): Promise<any | null> => {
  try {
    // Check if we're using IndexedDB
    const usingIndexedDB = localStorage.getItem('using-indexeddb') === 'true';
    
    // Try localStorage first if not marked for IndexedDB
    if (!usingIndexedDB) {
      const savedData = localStorage.getItem(CV_DATA_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    }
    
    // Fallback to IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(CV_DATA_KEY);
      
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        if (result) {
          console.log('CV data loaded from IndexedDB');
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        console.error('IndexedDB load error:', event);
        reject(new Error('Failed to load CV data from IndexedDB'));
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error loading CV data:', error);
    return null;
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

// Clear all CV data from both localStorage and IndexedDB
export const clearFormData = async (): Promise<void> => {
  try {
    // Clear from localStorage
    localStorage.removeItem(CV_DATA_KEY);
    localStorage.removeItem(CV_STEP_KEY);
    localStorage.removeItem('using-indexeddb');
    
    // Also clear from IndexedDB
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
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
  } catch (error) {
    console.error('Error clearing CV data:', error);
  }
};
