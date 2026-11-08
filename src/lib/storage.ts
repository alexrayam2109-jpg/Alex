import { get, set } from 'idb-keyval';
import { InspectionRecord } from '../types';
import { INITIAL_INSPECTIONS } from '../data/initialData';

const STORAGE_KEY = 'checklist_app_records_v1';

export async function loadInspectionsFromStorage(): Promise<InspectionRecord[]> {
  try {
    const data = await get<InspectionRecord[]>(STORAGE_KEY);
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Seed default records if empty
    await set(STORAGE_KEY, INITIAL_INSPECTIONS);
    return INITIAL_INSPECTIONS;
  } catch (err) {
    console.error('Failed to read from IndexedDB, using fallback:', err);
    return INITIAL_INSPECTIONS;
  }
}

export async function saveInspectionsToStorage(records: InspectionRecord[]): Promise<void> {
  try {
    await set(STORAGE_KEY, records);
  } catch (err) {
    console.error('Failed to save to IndexedDB:', err);
  }
}

export async function clearAllStorageData(): Promise<void> {
  try {
    await set(STORAGE_KEY, []);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
