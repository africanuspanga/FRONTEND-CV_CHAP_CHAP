/**
 * Centralized storage keys to ensure consistency across the application
 * This prevents data loss from inconsistent key formats
 */

// The main key for CV form data storage - standardized across all storage methods
export const CV_FORM_DATA_KEY = 'cv_form_data';

// Key for storing the current step in the CV creation workflow
export const CV_FORM_STEP_KEY = 'cv_form_step';

// Key for storing the selected template ID
export const CV_TEMPLATE_ID_KEY = 'cv_template_id';

// Compression-related keys
export const COMPRESSED_PREFIX = 'cv_compressed_';
export const CHUNK_COUNT_KEY = 'cv_compressed_chunks';

// Feature flags
export const USING_COMPRESSION_FLAG = 'using_compression';
export const USING_INDEXEDDB_FLAG = 'using_indexeddb';