import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ProducerStatus = 'invited' | 'accepted' | 'declined' | 'pending';
export type SalaryMatrixStatus = 'submitted' | 'in_progress' | 'missing';
export type DataConsentLevel = 'full' | 'aggregate';
export type FacilityPhase = 'Training' | 'Submission' | 'Draft Report' | 'Audit Verification' | 'Final Report';

export interface FacilityDetail {
  id: string;
  facilityId: string;
  name: string;
  email: string;
  producerId: string;
  producerName: string;
  country: string;
  flag: string;
  region: string;
  sector: string;
  year: number;
  phase: FacilityPhase;
  progress: number;
  gapOverall: number;
  gapFemale: number;
  gapMale: number;
  salaryMatrixStatus: SalaryMatrixStatus;
  consentType: DataConsentLevel;
  audited: boolean;
  lastUpdated: string;
  status: 'active' | 'under_review' | 'closed';
}

export interface ConsentDetails {
  dataGranularity: DataConsentLevel;
  duration: 'single' | 'ongoing';
  payrollYears: number[];
  auditData: boolean;
  voluntaryContribution: boolean;
}

export interface Producer {
  id: string;
  name: string;
  email: string;
  facilitiesCount: number;
  facilities: FacilityDetail[];
  status: ProducerStatus;
  invitedAt: string;
  invitedBy: string;
  respondedAt?: string;
  consent?: ConsentDetails;
  declineReason?: string;
}

interface ProducerStoreContext {
  producers: Producer[];
  allFacilities: FacilityDetail[];
  addProducers: (rows: { facilityId: string; email: string }[]) => void;
  clearProducers: () => void;
  updateProducerName: (id: string, name: string) => void;
}

const Ctx = createContext<ProducerStoreContext | null>(null);

function deriveProducerName(email: string): string {
  const domain = email.split('@')[1] ?? '';
  const name = domain.split('.')[0] ?? 'Unknown';
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
}

const DEMO_STATUSES: ProducerStatus[] = [
  'invited', 'accepted', 'invited', 'declined', 'accepted',
  'invited', 'accepted', 'invited', 'invited', 'accepted',
  'declined', 'invited', 'accepted', 'invited', 'invited',
  'accepted', 'invited', 'invited', 'accepted', 'invited',
];

const CURRENT_YEAR = new Date().getFullYear();

const FACILITY_NAMES = [
  'Processing Plant', 'Cocoa Facility', 'Textile Center', 'Manufacturing Hub',
  'Garment Factory', 'Food Processing', 'Tea Estate', 'Cotton Mill',
  'Assembly Line', 'Packaging Unit', 'Distribution Center', 'Sorting Facility',
];

const COUNTRIES: { name: string; flag: string; regions: string[] }[] = [
  { name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}', regions: ['Red River Delta', 'Ho Chi Minh City', 'Central Highlands'] },
  { name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', regions: ['Greater Accra', 'Ashanti', 'Western'] },
  { name: 'India', flag: '\u{1F1EE}\u{1F1F3}', regions: ['Maharashtra', 'Tamil Nadu', 'Karnataka'] },
  { name: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', regions: ['S\u00E3o Paulo State', 'Minas Gerais', 'Rio de Janeiro'] },
  { name: 'Bangladesh', flag: '\u{1F1E7}\u{1F1E9}', regions: ['Dhaka Division', 'Chittagong', 'Rajshahi'] },
  { name: 'Kenya', flag: '\u{1F1F0}\u{1F1EA}', regions: ['Nairobi County', 'Mombasa', 'Kisumu'] },
  { name: 'Ethiopia', flag: '\u{1F1EA}\u{1F1F9}', regions: ['Addis Ababa', 'Oromia', 'Amhara'] },
];

const SECTORS = ['Tea', 'Coffee', 'Textiles', 'Garments', 'Cocoa', 'Horticulture'];

const PHASES: FacilityPhase[] = ['Training', 'Submission', 'Draft Report', 'Audit Verification', 'Final Report'];

const PHASE_PROGRESS: Record<FacilityPhase, number> = {
  'Training': 10,
  'Submission': 30,
  'Draft Report': 55,
  'Audit Verification': 75,
  'Final Report': 100,
};

const LAST_UPDATED_OPTIONS = [
  '1 day ago', '2 days ago', '3 days ago', '5 days ago',
  '1 week ago', '2 weeks ago', '1 month ago', '3 months ago',
];

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDemoConsent(status: ProducerStatus): ConsentDetails | undefined {
  if (status !== 'accepted') return undefined;
  const granularities: DataConsentLevel[] = ['full', 'aggregate'];
  const durations: ('single' | 'ongoing')[] = ['single', 'ongoing'];
  return {
    dataGranularity: granularities[Math.floor(Math.random() * 2)],
    duration: durations[Math.floor(Math.random() * 2)],
    payrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1],
    auditData: Math.random() > 0.4,
    voluntaryContribution: Math.random() > 0.5,
  };
}

function generateFacilities(
  producerId: string,
  producerName: string,
  facilityRows: { facilityId: string; email: string }[],
  seedOffset: number,
): FacilityDetail[] {
  return facilityRows.map((row, i) => {
    const seed = seedOffset + i;
    const r = (n: number) => seededRandom(seed * 13 + n);
    const country = COUNTRIES[Math.floor(r(1) * COUNTRIES.length)];
    const region = country.regions[Math.floor(r(2) * country.regions.length)];
    const sector = SECTORS[Math.floor(r(3) * SECTORS.length)];
    const year = r(4) > 0.3 ? CURRENT_YEAR : CURRENT_YEAR - 1;
    const phase = PHASES[Math.floor(r(5) * PHASES.length)];
    const gapBase = 5 + r(6) * 25;
    const gapFemale = gapBase + (r(7) - 0.5) * 6;
    const gapMale = gapBase + (r(8) - 0.5) * 6;
    const cityName = country.regions[Math.floor(r(9) * country.regions.length)].split(' ')[0];
    const facilityType = FACILITY_NAMES[Math.floor(r(10) * FACILITY_NAMES.length)];

    return {
      id: crypto.randomUUID(),
      facilityId: row.facilityId,
      name: `${cityName} ${facilityType}`,
      email: row.email,
      producerId,
      producerName,
      country: country.name,
      flag: country.flag,
      region,
      sector,
      year,
      phase,
      progress: PHASE_PROGRESS[phase] + Math.floor(r(11) * 15),
      gapOverall: Math.round(gapBase * 10) / 10,
      gapFemale: Math.round(gapFemale * 10) / 10,
      gapMale: Math.round(gapMale * 10) / 10,
      salaryMatrixStatus: phase === 'Final Report' ? 'submitted' : phase === 'Training' ? 'missing' : 'in_progress',
      consentType: r(12) > 0.5 ? 'full' : 'aggregate',
      audited: phase === 'Final Report' || phase === 'Audit Verification',
      lastUpdated: LAST_UPDATED_OPTIONS[Math.floor(r(13) * LAST_UPDATED_OPTIONS.length)],
      status: r(14) > 0.15 ? 'active' : r(14) > 0.05 ? 'under_review' : 'closed',
    };
  });
}

export function ProducerStoreProvider({ children }: { children: ReactNode }) {
  const [producers, setProducers] = useState<Producer[]>([]);

  const addProducers = useCallback((rows: { facilityId: string; email: string }[]) => {
    const grouped = new Map<string, { facilityId: string; email: string }[]>();
    rows.forEach(r => {
      const domain = r.email.split('@')[1] ?? r.email;
      if (!grouped.has(domain)) grouped.set(domain, []);
      grouped.get(domain)!.push(r);
    });

    const newProducers: Producer[] = Array.from(grouped.entries()).map(([, facilityRows], idx) => {
      const rep = facilityRows[0];
      const status = DEMO_STATUSES[idx % DEMO_STATUSES.length];
      const hasResponded = status === 'accepted' || status === 'declined';
      const declineReasons = [
        'We are unable to share salary data for the requested period due to ongoing internal restructuring.',
        'The requested payroll years include data that is currently under audit review.',
        'We only share data with direct buyers, not through intermediaries.',
      ];
      const producerId = crypto.randomUUID();
      const producerName = deriveProducerName(rep.email);
      return {
        id: producerId,
        name: producerName,
        email: rep.email,
        facilitiesCount: facilityRows.length,
        facilities: generateFacilities(producerId, producerName, facilityRows, idx * 100),
        status,
        invitedAt: new Date().toISOString(),
        invitedBy: 'Morgan',
        respondedAt: hasResponded ? new Date(Date.now() - Math.random() * 86400000 * 3).toISOString() : undefined,
        consent: generateDemoConsent(status),
        declineReason: status === 'declined' ? declineReasons[idx % declineReasons.length] : undefined,
      };
    });

    setProducers(prev => [...prev, ...newProducers]);
  }, []);

  const clearProducers = useCallback(() => setProducers([]), []);

  const updateProducerName = useCallback((id: string, name: string) => {
    setProducers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const allFacilities = producers.flatMap(p => p.facilities);

  return (
    <Ctx.Provider value={{ producers, allFacilities, addProducers, clearProducers, updateProducerName }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProducerStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useProducerStore must be used within ProducerStoreProvider');
  return ctx;
}
