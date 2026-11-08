import { InspectionRecord } from '../types';

// SVG graphic placeholders to simulate camera inspection photos cleanly
function makeSamplePhoto(label: string, status: 'OK' | 'Not OK' | 'Pending'): string {
  const bg = status === 'OK' ? '#10B981' : status === 'Not OK' ? '#EF4444' : '#F59E0B';
  const icon = status === 'OK' ? '✓ PASS' : status === 'Not OK' ? '⚠ DEFECT' : '⏳ PENDING';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="400" height="300" fill="#1F2937"/>
    <rect x="20" y="20" width="360" height="260" rx="12" fill="#374151" stroke="${bg}" stroke-width="4"/>
    <circle cx="200" cy="110" r="45" fill="${bg}" opacity="0.2"/>
    <text x="200" y="118" font-family="system-ui, sans-serif" font-size="20" font-weight="bold" fill="${bg}" text-anchor="middle">${icon}</text>
    <text x="200" y="180" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#F9FAFB" text-anchor="middle">${label}</text>
    <rect x="50" y="215" width="300" height="30" rx="6" fill="#111827"/>
    <text x="200" y="235" font-family="monospace" font-size="12" fill="#9CA3AF" text-anchor="middle">SITE CAM • AUDIT STAMP #${Math.floor(1000 + Math.random() * 9000)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const todayStr = new Date().toISOString().split('T')[0];
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'rec-101',
    referenceNo: 'CHK-2026-0801',
    title: 'Daily FM Building Facilities Cleaning Audit',
    category: 'Cleaning',
    locationId: 'z1-fm',
    locationName: 'Zone 1 FM Building',
    subLocation: 'Ground Floor & Admin Offices',
    inspectorName: 'Alex Mercer (Lead FM Inspector)',
    inspectorId: 'EMP-4091',
    inspectionDate: todayStr,
    createdAt: `${todayStr}T08:30:00.000Z`,
    updatedAt: `${todayStr}T08:45:00.000Z`,
    overallStatus: 'In Progress',
    tasks: [
      {
        id: 'task-101-1',
        category: 'Cleaning',
        title: 'Main Entrance & Lobby Sweeping & Mopping',
        description: 'Ensure main entry floors are free of dust, debris, stains, and polished dry.',
        status: 'OK',
        remarks: 'Main lobby scrubbed clean with floor scrubber. High shine achieved.',
        timestamp: `${todayStr}T08:32:00.000Z`,
        lastUpdated: `${todayStr}T08:32:00.000Z`,
        photos: [
          {
            id: 'pho-1',
            dataUrl: makeSamplePhoto('Main Lobby Floor Cleanliness', 'OK'),
            fileName: 'lobby_floor_ok.jpg',
            caption: 'Main entrance marble floor after mopping',
            timestamp: `${todayStr}T08:33:00.000Z`,
          },
        ],
      },
      {
        id: 'task-101-2',
        category: 'Cleaning',
        title: 'Washroom Sanitization & Soap/Paper Refill',
        description: 'Sanitize toilets, urinals, sinks, mirrors, and replenish hand soap and paper towels.',
        status: 'Not OK',
        remarks: 'Soap dispenser in East Restroom broken and leaking onto counter.',
        timestamp: `${todayStr}T08:38:00.000Z`,
        lastUpdated: `${todayStr}T08:38:00.000Z`,
        photos: [
          {
            id: 'pho-2',
            dataUrl: makeSamplePhoto('Soap Dispenser Leak', 'Not OK'),
            fileName: 'washroom_leak.jpg',
            caption: 'Broken soap dispenser unit needing replacement',
            timestamp: `${todayStr}T08:39:00.000Z`,
          },
        ],
      },
      {
        id: 'task-101-3',
        category: 'Cleaning',
        title: 'Glass Doors & Window Surfaces',
        description: 'Clean fingerprints, smudges, and dirt from all glass panels, partitions, and doors.',
        status: 'OK',
        remarks: 'All glass doors cleaned with streak-free solution.',
        timestamp: `${todayStr}T08:42:00.000Z`,
        lastUpdated: `${todayStr}T08:42:00.000Z`,
        photos: [],
      },
      {
        id: 'task-101-4',
        category: 'Cleaning',
        title: 'Waste Bin Emptying & Liner Replacement',
        description: 'Empty all trash bins, replace bio/general waste liners, and sanitize bin containers.',
        status: 'Pending',
        remarks: 'Awaiting specialized recycling bin collection at 10:00 AM.',
        timestamp: `${todayStr}T08:44:00.000Z`,
        lastUpdated: `${todayStr}T08:44:00.000Z`,
        photos: [],
      },
    ],
  },

  {
    id: 'rec-102',
    referenceNo: 'CHK-2026-0802',
    title: 'Zone 3 A & B MEP Systems Bi-Weekly Inspection',
    category: 'MEP',
    locationId: 'z3-ab',
    locationName: 'Zone 3 A & B (Buildings & Villas)',
    subLocation: 'Building 4 & Villa 18 Plant Rooms',
    inspectorName: 'David Chen (MEP Engineer)',
    inspectorId: 'EMP-7721',
    inspectionDate: todayStr,
    createdAt: `${todayStr}T09:15:00.000Z`,
    updatedAt: `${todayStr}T09:55:00.000Z`,
    overallStatus: 'Fail',
    tasks: [
      {
        id: 'task-102-1',
        category: 'MEP',
        title: 'Main Electrical Panel & DB Board Visual Inspection',
        description: 'Check for abnormal heat, loose wiring, tripped breakers, and ensure panel doors are locked.',
        status: 'OK',
        remarks: 'DB-B4 panel voltage reading normal (230V/400V). Thermal scan clear.',
        timestamp: `${todayStr}T09:20:00.000Z`,
        lastUpdated: `${todayStr}T09:20:00.000Z`,
        photos: [
          {
            id: 'pho-3',
            dataUrl: makeSamplePhoto('Building 4 Main DB Panel', 'OK'),
            fileName: 'db_panel_normal.jpg',
            caption: 'Main distribution panel voltage display normal',
            timestamp: `${todayStr}T09:21:00.000Z`,
          },
        ],
      },
      {
        id: 'task-102-2',
        category: 'MEP',
        title: 'HVAC & FCU Air Filter & Condensate Line Check',
        description: 'Inspect air return filters for dust blockage, check cooling performance, and verify drain flow.',
        status: 'Not OK',
        remarks: 'Villa 18 FCU Unit 2 condensate line clogged, causing water overflow into tray.',
        timestamp: `${todayStr}T09:35:00.000Z`,
        lastUpdated: `${todayStr}T09:35:00.000Z`,
        photos: [
          {
            id: 'pho-4',
            dataUrl: makeSamplePhoto('Clogged FCU Condensate Drain', 'Not OK'),
            fileName: 'fcu_drain_clog.jpg',
            caption: 'Water accumulation in secondary drip tray',
            timestamp: `${todayStr}T09:36:00.000Z`,
          },
        ],
      },
      {
        id: 'task-102-3',
        category: 'MEP',
        title: 'Water Booster Pump Pressure & Leak Inspection',
        description: 'Verify system operating pressure, inspect mechanical seals for water leaks, check control panel.',
        status: 'OK',
        remarks: 'Booster pump 1 and 2 operating smoothly at 4.2 bar.',
        timestamp: `${todayStr}T09:45:00.000Z`,
        lastUpdated: `${todayStr}T09:45:00.000Z`,
        photos: [],
      },
      {
        id: 'task-102-4',
        category: 'MEP',
        title: 'Fire Extinguishers & Fire Hose Cabinet Audit',
        description: 'Check pressure gauge indicator in green zone, inspect safety pin seal, and update audit tags.',
        status: 'OK',
        remarks: 'Building 4 levels 1-3 fire extinguishers inspected and tagged.',
        timestamp: `${todayStr}T09:50:00.000Z`,
        lastUpdated: `${todayStr}T09:50:00.000Z`,
        photos: [],
      },
    ],
  },

  {
    id: 'rec-103',
    referenceNo: 'CHK-2026-0803',
    title: 'Swimming Pool & Central Park Landscape Inspection',
    category: 'Landscape',
    locationId: 'pool',
    locationName: 'Swimming Pool Area',
    subLocation: 'Main Pool & Sundeck Turf',
    inspectorName: 'Maria Santos (Landscape Supervisor)',
    inspectorId: 'EMP-3105',
    inspectionDate: yesterdayStr,
    createdAt: `${yesterdayStr}T14:00:00.000Z`,
    updatedAt: `${yesterdayStr}T14:40:00.000Z`,
    overallStatus: 'Pass',
    tasks: [
      {
        id: 'task-103-1',
        category: 'Landscape',
        title: 'Swimming Pool Water Clarity, pH & Chlorine Level',
        description: 'Test pH (7.2-7.6), free chlorine levels, vacuum pool floor, and clean skimmer baskets.',
        status: 'OK',
        remarks: 'pH 7.4, Free Chlorine 2.5 ppm. Water crystal clear.',
        timestamp: `${yesterdayStr}T14:05:00.000Z`,
        lastUpdated: `${yesterdayStr}T14:05:00.000Z`,
        photos: [
          {
            id: 'pho-5',
            dataUrl: makeSamplePhoto('Pool Water Test & Clarity', 'OK'),
            fileName: 'pool_clarity.jpg',
            caption: 'Pool chemical test kit reading pH 7.4',
            timestamp: `${yesterdayStr}T14:06:00.000Z`,
          },
        ],
      },
      {
        id: 'task-103-2',
        category: 'Landscape',
        title: 'Irrigation Sprinklers & Automatic Drip Line Test',
        description: 'Run zone test, adjust misaligned pop-up nozzles, fix broken drip emitters and pipe leaks.',
        status: 'OK',
        remarks: 'Zone 3 pool perimeter drip lines checked. All nozzles firing correctly.',
        timestamp: `${yesterdayStr}T14:20:00.000Z`,
        lastUpdated: `${yesterdayStr}T14:20:00.000Z`,
        photos: [],
      },
      {
        id: 'task-103-3',
        category: 'Landscape',
        title: 'Lawn Mowing & Turf Grass Height Uniformity',
        description: 'Mow grass to standard 2-3 inch height, trim lawn edges along concrete borders and paths.',
        status: 'OK',
        remarks: 'Sundeck Bermuda grass mowed to 2.5 inches. Edges trimmed.',
        timestamp: `${yesterdayStr}T14:35:00.000Z`,
        lastUpdated: `${yesterdayStr}T14:35:00.000Z`,
        photos: [],
      },
    ],
  },

  {
    id: 'rec-104',
    referenceNo: 'CHK-2026-0804',
    title: 'Zone 2 Sales Center & Village Square MEP & Cleaning',
    category: 'Cleaning',
    locationId: 'z2-sales',
    locationName: 'Zone 2 Sales Center',
    subLocation: 'Main Sales Hall & VIP Lounges',
    inspectorName: 'Sarah Jenkins (Quality Control)',
    inspectorId: 'EMP-1192',
    inspectionDate: threeDaysAgoStr,
    createdAt: `${threeDaysAgoStr}T10:00:00.000Z`,
    updatedAt: `${threeDaysAgoStr}T10:30:00.000Z`,
    overallStatus: 'Pass',
    tasks: [
      {
        id: 'task-104-1',
        category: 'Cleaning',
        title: 'Glass Doors & Window Surfaces',
        description: 'Clean fingerprints, smudges, and dirt from all glass panels, partitions, and doors.',
        status: 'OK',
        remarks: 'Sales center glass facade polished clear.',
        timestamp: `${threeDaysAgoStr}T10:05:00.000Z`,
        lastUpdated: `${threeDaysAgoStr}T10:05:00.000Z`,
        photos: [],
      },
      {
        id: 'task-104-2',
        category: 'Cleaning',
        title: 'Main Entrance & Lobby Sweeping & Mopping',
        description: 'Ensure main entry floors are free of dust, debris, stains, and polished dry.',
        status: 'OK',
        remarks: 'Polished granite floor pristine.',
        timestamp: `${threeDaysAgoStr}T10:15:00.000Z`,
        lastUpdated: `${threeDaysAgoStr}T10:15:00.000Z`,
        photos: [],
      },
      {
        id: 'task-104-3',
        category: 'Cleaning',
        title: 'Lift/Elevator Interior & Button Panel Sanitization',
        description: 'Clean elevator stainless steel walls, mirrors, floor matting, and sanitize call buttons.',
        status: 'N/A',
        remarks: 'Single level building - no elevator.',
        timestamp: `${threeDaysAgoStr}T10:25:00.000Z`,
        lastUpdated: `${threeDaysAgoStr}T10:25:00.000Z`,
        photos: [],
      },
    ],
  },
];
