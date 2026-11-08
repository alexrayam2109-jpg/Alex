export type ChecklistCategory = 'Cleaning' | 'MEP' | 'Landscape';

export type TaskStatus = 'OK' | 'Not OK' | 'Pending' | 'N/A';

export interface LocationConfig {
  id: string;
  name: string;
  code: string;
  subType?: 'none' | 'buildings_and_villas' | 'custom';
  buildingCount?: number;
  villaCount?: number;
}

export interface PhotoAttachment {
  id: string;
  dataUrl: string; // Base64 or Blob URL
  fileName: string;
  caption?: string;
  timestamp: string; // ISO string
}

export interface InspectionTask {
  id: string;
  category: ChecklistCategory;
  title: string;
  description?: string;
  status: TaskStatus;
  remarks?: string;
  photos: PhotoAttachment[];
  timestamp: string; // ISO string created/checked
  lastUpdated: string; // ISO string
}

export interface InspectionRecord {
  id: string;
  referenceNo: string;
  title: string;
  category: ChecklistCategory;
  locationId: string;
  locationName: string;
  subLocation?: string; // e.g., "Building 4", "Villa 12", "Main Entrance"
  inspectorName: string;
  inspectorId?: string;
  inspectionDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  tasks: InspectionTask[];
  overallStatus: 'Pass' | 'Fail' | 'In Progress';
  signature?: string; // Data URL for inspector signature
}

export interface TemplateItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  description: string;
  defaultStatus?: TaskStatus;
}

export interface ReportFilter {
  locationId: string; // 'ALL' or specific location ID
  category: string;   // 'ALL' or specific category
  status: string;     // 'ALL' or specific status
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  searchQuery: string;
}

export interface LocationStats {
  locationId: string;
  locationName: string;
  totalTasks: number;
  okCount: number;
  notOkCount: number;
  pendingCount: number;
  naCount: number;
  totalInspections: number;
}
