// IndexedDB storage service for local PDF files in JUSTIQ-AI
// Keeps genuine uploaded PDF Blobs available across browser refreshes without external backend/DB.

const DB_NAME = 'JUSTIQ_FILES_DB';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_documents';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Store a PDF file (Blob or File) linked to a judgment ID.
 */
export async function storePDFFile(judgmentId, file, fileName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const record = {
        id: judgmentId,
        fileName: fileName || file.name,
        fileType: file.type || 'application/pdf',
        fileSize: file.size,
        blob: file,
        uploadedAt: new Date().toISOString(),
      };

      const request = store.put(record);

      request.onsuccess = () => {
        resolve(record);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to save file in IndexedDB'));
      };
    });
  } catch (err) {
    console.error('storePDFFile error:', err);
    throw err;
  }
}

/**
 * Retrieve a stored PDF record by judgment ID.
 */
export async function getPDFFile(judgmentId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(judgmentId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to retrieve file from IndexedDB'));
      };
    });
  } catch (err) {
    console.error('getPDFFile error:', err);
    return null;
  }
}

/**
 * Delete a stored PDF file by judgment ID.
 */
export async function deletePDFFile(judgmentId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(judgmentId);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error || new Error('Failed to delete file from IndexedDB'));
      };
    });
  } catch (err) {
    console.error('deletePDFFile error:', err);
    return false;
  }
}
