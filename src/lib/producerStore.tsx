import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ProducerStatus = 'invited' | 'accepted' | 'declined' | 'pending';
export type SalaryMatrixStatus = 'submitted' | 'in_progress' | 'missing';
export type DataConsentLevel = 'full' | 'aggregate';
export type FacilityStatus = 'Not Started' | 'Draft' | 'Submitted' | 'Final Report';

export interface FacilityDetail {
  id: string;
  facilityId: string;
  name: string;
  email: string;
  producerId: string;
  producerName: string;
  buyerId: string;
  buyerName: string;
  intermediaryId?: string;
  intermediaryName?: string;
  country: string;
  flag: string;
  region: string;
  sector: string;
  product?: string;
  year: number;
  reportStatus: FacilityStatus;
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
  buyerIds: string[];
  buyerNames: string[];
  status: ProducerStatus;
  invitedAt: string;
  invitedBy: string;
  source: 'direct' | 'intermediary';
  respondedAt?: string;
  consent?: ConsentDetails;
  declineReason?: string;
}

interface ProducerStoreContext {
  producers: Producer[];
  allFacilities: FacilityDetail[];
  addProducers: (rows: { facilityId: string; email: string }[], buyerId: string, buyerName: string) => void;
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

const SECTORS = ['Tea', 'Coffee', 'Textiles', 'Garments', 'Cocoa', 'Horticulture', 'Bananas'];

const PRODUCTS = {
  'Tea': ['Black Tea', 'Green Tea', 'White Tea', 'Oolong Tea'],
  'Coffee': ['Arabica', 'Robusta', 'Specialty Blends'],
  'Textiles': ['Cotton Fabric', 'Denim', 'Synthetic Blends', 'Wool'],
  'Garments': ['T-Shirts', 'Jeans', 'Dresses', 'Uniforms', 'Sportswear'],
  'Cocoa': ['Cocoa Beans', 'Cocoa Powder', 'Cocoa Butter'],
  'Horticulture': ['Fresh Flowers', 'Vegetables', 'Herbs'],
  'Bananas': ['Cavendish', 'Plantains', 'Lady Finger', 'Organic Bananas'],
};

const STATUSES: FacilityStatus[] = ['Not Started', 'Draft', 'Submitted', 'Final Report'];

const STATUS_PROGRESS: Record<FacilityStatus, number> = {
  'Not Started': 0,
  'Draft': 35,
  'Submitted': 70,
  'Final Report': 100,
};

const INTERMEDIARIES = [
  { id: 'int-1', name: 'David Osei' },
  { id: 'int-2', name: 'Elena Rossi' },
  { id: 'int-3', name: 'Samuel Kimani' },
];

function generateAbsoluteTimestamp(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(9 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60));
  return date.toISOString();
}

const LAST_UPDATED_DAYS = [1, 2, 3, 5, 7, 14, 30, 90];

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
  buyerId: string,
  buyerName: string,
  facilityRows: { facilityId: string; email: string }[],
  seedOffset: number,
): FacilityDetail[] {
  const facilities: FacilityDetail[] = [];

  facilityRows.forEach((row, i) => {
    const seed = seedOffset + i;
    const r = (n: number) => seededRandom(seed * 13 + n);
    const country = COUNTRIES[Math.floor(r(1) * COUNTRIES.length)];
    const region = country.regions[Math.floor(r(2) * country.regions.length)];
    const sector = SECTORS[Math.floor(r(3) * SECTORS.length)];
    const products = PRODUCTS[sector as keyof typeof PRODUCTS] || [];
    const product = products[Math.floor(r(4) * products.length)];
    const cityName = country.regions[Math.floor(r(9) * country.regions.length)].split(' ')[0];
    const facilityType = FACILITY_NAMES[Math.floor(r(10) * FACILITY_NAMES.length)];
    const facilityName = `${cityName} ${facilityType}`;

    const hasIntermediary = r(16) > 0.6;
    const intermediary = hasIntermediary ? INTERMEDIARIES[Math.floor(r(17) * INTERMEDIARIES.length)] : undefined;

    const shouldHaveHistoricalData = r(15) > 0.4;
    const years = shouldHaveHistoricalData ? [CURRENT_YEAR, CURRENT_YEAR - 1] : [CURRENT_YEAR];

    years.forEach((year, yearIndex) => {
      const yearSeed = seed + yearIndex * 1000;
      const ry = (n: number) => seededRandom(yearSeed * 17 + n);
      const reportStatus = STATUSES[Math.floor(ry(5) * STATUSES.length)];
      const gapBase = 5 + ry(6) * 25;
      const gapFemale = gapBase + (ry(7) - 0.5) * 6;
      const gapMale = gapBase + (ry(8) - 0.5) * 6;

      facilities.push({
        id: crypto.randomUUID(),
        facilityId: row.facilityId,
        name: facilityName,
        email: row.email,
        producerId,
        producerName,
        buyerId,
        buyerName,
        intermediaryId: intermediary?.id,
        intermediaryName: intermediary?.name,
        country: country.name,
        flag: country.flag,
        region,
        sector,
        product,
        year,
        reportStatus,
        progress: STATUS_PROGRESS[reportStatus] + Math.floor(ry(11) * 15),
        gapOverall: Math.round(gapBase * 10) / 10,
        gapFemale: Math.round(gapFemale * 10) / 10,
        gapMale: Math.round(gapMale * 10) / 10,
        salaryMatrixStatus: reportStatus === 'Final Report' ? 'submitted' : reportStatus === 'Not Started' ? 'missing' : 'in_progress',
        consentType: ry(12) > 0.5 ? 'full' : 'aggregate',
        audited: reportStatus === 'Final Report',
        lastUpdated: generateAbsoluteTimestamp(LAST_UPDATED_DAYS[Math.floor(ry(13) * LAST_UPDATED_DAYS.length)]),
        status: ry(14) > 0.15 ? 'active' : ry(14) > 0.05 ? 'under_review' : 'closed',
      });
    });
  });

  return facilities;
}

export function ProducerStoreProvider({ children }: { children: ReactNode }) {
  const [producers, setProducers] = useState<Producer[]>([]);

  const addProducers = useCallback((rows: { facilityId: string; email: string }[], buyerId: string, buyerName: string) => {
    const grouped = new Map<string, { facilityId: string; email: string }[]>();
    rows.forEach(r => {
      const domain = r.email.split('@')[1] ?? r.email;
      if (!grouped.has(domain)) grouped.set(domain, []);
      grouped.get(domain)!.push(r);
    });

    setProducers(prev => {
      const updatedProducers = [...prev];

      Array.from(grouped.entries()).forEach(([, facilityRows], idx) => {
        const rep = facilityRows[0];
        const producerName = deriveProducerName(rep.email);
        const existingProducer = updatedProducers.find(p => p.email === rep.email);

        if (existingProducer) {
          if (!existingProducer.buyerIds.includes(buyerId)) {
            existingProducer.buyerIds.push(buyerId);
            existingProducer.buyerNames.push(buyerName);
            const newFacilities = generateFacilities(
              existingProducer.id,
              existingProducer.name,
              buyerId,
              buyerName,
              facilityRows,
              (updatedProducers.length + idx) * 100
            );
            existingProducer.facilities.push(...newFacilities);
            existingProducer.facilitiesCount = existingProducer.facilities.length;
          }
        } else {
          const status = DEMO_STATUSES[idx % DEMO_STATUSES.length];
          const hasResponded = status === 'accepted' || status === 'declined';
          const declineReasons = [
            'We are unable to share salary data for the requested period due to ongoing internal restructuring.',
            'The requested payroll years include data that is currently under audit review.',
            'We only share data with direct buyers, not through intermediaries.',
          ];
          const producerId = crypto.randomUUID();
          updatedProducers.push({
            id: producerId,
            name: producerName,
            email: rep.email,
            facilitiesCount: facilityRows.length,
            facilities: generateFacilities(producerId, producerName, buyerId, buyerName, facilityRows, (updatedProducers.length + idx) * 100),
            buyerIds: [buyerId],
            buyerNames: [buyerName],
            status,
            invitedAt: new Date().toISOString(),
            invitedBy: 'Morgan',
            source: Math.random() > 0.7 ? 'intermediary' : 'direct',
            respondedAt: hasResponded ? new Date(Date.now() - Math.random() * 86400000 * 3).toISOString() : undefined,
            consent: generateDemoConsent(status),
            declineReason: status === 'declined' ? declineReasons[idx % declineReasons.length] : undefined,
          });
        }
      });

      return updatedProducers;
    });
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
