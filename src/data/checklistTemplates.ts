import { TemplateItem, ChecklistCategory } from '../types';

export const DEFAULT_TEMPLATES: TemplateItem[] = [
  // --- CLEANING CHECKLIST TEMPLATES ---
  {
    id: 'cl-1',
    category: 'Cleaning',
    title: 'Main Entrance & Lobby Sweeping & Mopping',
    description: 'Ensure main entry floors are free of dust, debris, stains, and polished dry.',
  },
  {
    id: 'cl-2',
    category: 'Cleaning',
    title: 'Glass Doors & Window Surfaces',
    description: 'Clean fingerprints, smudges, and dirt from all glass panels, partitions, and doors.',
  },
  {
    id: 'cl-3',
    category: 'Cleaning',
    title: 'Washroom Sanitization & Soap/Paper Refill',
    description: 'Sanitize toilets, urinals, sinks, mirrors, and replenish hand soap and paper towels.',
  },
  {
    id: 'cl-4',
    category: 'Cleaning',
    title: 'Waste Bin Emptying & Liner Replacement',
    description: 'Empty all trash bins, replace bio/general waste liners, and sanitize bin containers.',
  },
  {
    id: 'cl-5',
    category: 'Cleaning',
    title: 'Corridors & Stairwell Dusting & Railings Wipe',
    description: 'Dust emergency lights, signage, wipe down handrails and remove cobwebs.',
  },
  {
    id: 'cl-6',
    category: 'Cleaning',
    title: 'Lift/Elevator Interior & Button Panel Sanitization',
    description: 'Clean elevator stainless steel walls, mirrors, floor matting, and sanitize call buttons.',
  },
  {
    id: 'cl-7',
    category: 'Cleaning',
    title: 'Exterior Pavement & Waste Storage Cleanliness',
    description: 'Sweep outer walkways, pressure wash stained areas, clear garbage chute intake.',
  },

  // --- MEP CHECKLIST TEMPLATES ---
  {
    id: 'mep-1',
    category: 'MEP',
    title: 'Main Electrical Panel & DB Board Visual Inspection',
    description: 'Check for abnormal heat, loose wiring, tripped breakers, and ensure panel doors are locked.',
  },
  {
    id: 'mep-2',
    category: 'MEP',
    title: 'HVAC & FCU Air Filter & Condensate Line Check',
    description: 'Inspect air return filters for dust blockage, check cooling performance, and verify drain flow.',
  },
  {
    id: 'mep-3',
    category: 'MEP',
    title: 'Water Booster Pump Pressure & Leak Inspection',
    description: 'Verify system operating pressure, inspect mechanical seals for water leaks, check control panel.',
  },
  {
    id: 'mep-4',
    category: 'MEP',
    title: 'Emergency & Exit Illumination Battery Test',
    description: 'Test emergency lighting units on push-button check, verify illuminated exit signs operational.',
  },
  {
    id: 'mep-5',
    category: 'MEP',
    title: 'Plumbing Fixtures, Valves & Drainage Check',
    description: 'Check water supply valves, inspect floor drains for blockages, verify sewer air trap seals.',
  },
  {
    id: 'mep-6',
    category: 'MEP',
    title: 'Fire Extinguishers & Fire Hose Cabinet Audit',
    description: 'Check pressure gauge indicator in green zone, inspect safety pin seal, and update audit tags.',
  },
  {
    id: 'mep-7',
    category: 'MEP',
    title: 'Generator Fuel & Battery System Status',
    description: 'Inspect diesel fuel level, battery voltage status, auto-transfer switch (ATS) indicator lights.',
  },

  // --- LANDSCAPE CHECKLIST TEMPLATES ---
  {
    id: 'ls-1',
    category: 'Landscape',
    title: 'Lawn Mowing & Turf Grass Height Uniformity',
    description: 'Mow grass to standard 2-3 inch height, trim lawn edges along concrete borders and paths.',
  },
  {
    id: 'ls-2',
    category: 'Landscape',
    title: 'Irrigation Sprinklers & Automatic Drip Line Test',
    description: 'Run zone test, adjust misaligned pop-up nozzles, fix broken drip emitters and pipe leaks.',
  },
  {
    id: 'ls-3',
    category: 'Landscape',
    title: 'Tree & Shrub Pruning & Deadwood Removal',
    description: 'Trim hazardous tree branches, remove dead leaves, shape bushes, and check tree guy wires.',
  },
  {
    id: 'ls-4',
    category: 'Landscape',
    title: 'Flower Bed Weeding & Mulch Replenishment',
    description: 'Remove invasive weeds, check soil moisture levels, loosen packed soil, and top up bark mulch.',
  },
  {
    id: 'ls-5',
    category: 'Landscape',
    title: 'Pest & Plant Disease Inspection',
    description: 'Inspect leaves for aphids, fungal spots, scale insects, or nutrient deficiency yellowing.',
  },
  {
    id: 'ls-6',
    category: 'Landscape',
    title: 'Swimming Pool Water Clarity, pH & Chlorine Level',
    description: 'Test pH (7.2-7.6), free chlorine levels, vacuum pool floor, and clean skimmer baskets.',
  },
  {
    id: 'ls-7',
    category: 'Landscape',
    title: 'Hardscape Pathway Clearing & Leaf Litter Removal',
    description: 'Blower sweep pedestrian pathways, remove fallen palm fronds, check outdoor garden lights.',
  },
];

export function getTemplatesByCategory(category: ChecklistCategory): TemplateItem[] {
  return DEFAULT_TEMPLATES.filter((item) => item.category === category);
}
