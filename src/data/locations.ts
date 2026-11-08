import { LocationConfig } from '../types';

export const LOCATIONS: LocationConfig[] = [
  {
    id: 'z1-fm',
    name: 'Zone 1 FM Building',
    code: 'Z1-FM',
    subType: 'none',
  },
  {
    id: 'z2-sales',
    name: 'Zone 2 Sales Center',
    code: 'Z2-SC',
    subType: 'none',
  },
  {
    id: 'z2-village',
    name: 'Zone 2 Village Square',
    code: 'Z2-VS',
    subType: 'none',
  },
  {
    id: 'z3-park',
    name: 'Zone 3 Central Park',
    code: 'Z3-CP',
    subType: 'none',
  },
  {
    id: 'pool',
    name: 'Swimming Pool Area',
    code: 'POOL',
    subType: 'none',
  },
  {
    id: 'z3-ab',
    name: 'Zone 3 A & B (Buildings & Villas)',
    code: 'Z3-AB',
    subType: 'buildings_and_villas',
    buildingCount: 21,
    villaCount: 43,
  },
  {
    id: 'z5',
    name: 'Zone 5',
    code: 'Z5',
    subType: 'none',
  },
  {
    id: 'z8',
    name: 'Zone 8',
    code: 'Z8',
    subType: 'none',
  },
];

// Helper to get helper lists for Zone 3 A & B options
export const ZONE3_BUILDINGS = Array.from({ length: 21 }, (_, i) => `Building ${i + 1}`);
export const ZONE3_VILLAS = Array.from({ length: 43 }, (_, i) => `Villa ${i + 1}`);

export function getLocationName(id: string): string {
  const found = LOCATIONS.find((loc) => loc.id === id);
  return found ? found.name : id;
}
