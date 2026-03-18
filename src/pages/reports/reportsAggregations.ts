import { WageCalculation } from '../../lib/reportsData';

export interface ReportsSummary {
  totalFacilities: number;
  facilitiesWithGap: number;
  avgLivingWageGapPct: number;
  avgGenderGapPct: number;
  workersBelowLwPct: number;
  workersBelowLwCount: number;
  totalWorkers: number;
  workersAboveLwWomen: number;
  workersBelowLwWomen: number;
  workersAboveLwMen: number;
  workersBelowLwMen: number;
}

export function computeSummary(data: WageCalculation[]): ReportsSummary {
  const empty: ReportsSummary = {
    totalFacilities: 0, facilitiesWithGap: 0, avgLivingWageGapPct: 0, avgGenderGapPct: 0,
    workersBelowLwPct: 0, workersBelowLwCount: 0, totalWorkers: 0,
    workersAboveLwWomen: 0, workersBelowLwWomen: 0,
    workersAboveLwMen: 0, workersBelowLwMen: 0,
  };
  if (data.length === 0) return empty;

  const facilityIds = new Set(data.map(c => c.facility_id));
  const facilitiesWithGap = new Set(data.filter(c => c.avg_wage_gap_pct > 0).map(c => c.facility_id));
  const totalWorkers = data.reduce((s, c) => s + c.total_workers, 0);
  const workersBelowLwCount = data.reduce((s, c) => s + c.workers_below_lw_count, 0);

  return {
    totalFacilities: facilityIds.size,
    facilitiesWithGap: facilitiesWithGap.size,
    avgLivingWageGapPct: data.reduce((s, c) => s + c.avg_wage_gap_pct, 0) / data.length,
    avgGenderGapPct: data.reduce((s, c) => s + c.gender_gap_pct, 0) / data.length,
    workersBelowLwPct: totalWorkers > 0 ? (workersBelowLwCount / totalWorkers) * 100 : 0,
    workersBelowLwCount,
    totalWorkers,
    workersAboveLwWomen: data.reduce((s, c) => s + c.workers_above_lw_women, 0),
    workersBelowLwWomen: data.reduce((s, c) => s + c.workers_below_lw_women, 0),
    workersAboveLwMen: data.reduce((s, c) => s + c.workers_above_lw_men, 0),
    workersBelowLwMen: data.reduce((s, c) => s + c.workers_below_lw_men, 0),
  };
}

export interface GapBucket {
  label: string;
  count: number;
}

const GAP_RANGES: { label: string; min: number; max: number }[] = [
  { label: '0%', min: 0, max: 0 },
  { label: '0.1% - 10%', min: 0.1, max: 10 },
  { label: '10.1% - 20%', min: 10.1, max: 20 },
  { label: '20.1% - 30%', min: 20.1, max: 30 },
  { label: '30.1% - 40%', min: 30.1, max: 40 },
  { label: '40.1% - 50%', min: 40.1, max: 50 },
  { label: 'Over 50%', min: 50.1, max: Infinity },
];

export function computeGapDistribution(data: WageCalculation[]): GapBucket[] {
  return GAP_RANGES.map(range => {
    const count = data.reduce((sum, c) => {
      if (range.max === 0) {
        return sum + (c.avg_wage_gap_pct === 0 ? c.total_workers : 0);
      }
      if (c.avg_wage_gap_pct >= range.min && c.avg_wage_gap_pct <= range.max) {
        return sum + c.total_workers;
      }
      return sum;
    }, 0);
    return { label: range.label, count };
  });
}

export interface GenderByFacility {
  facilityName: string;
  facilityId: string;
  country: string;
  flag: string;
  year: number;
  aboveWomen: number;
  belowWomen: number;
  aboveMen: number;
  belowMen: number;
  genderGapPct: number;
}

export function computeGenderByFacility(data: WageCalculation[]): GenderByFacility[] {
  return data.map(c => ({
    facilityName: c.facility_name,
    facilityId: c.facility_id,
    country: c.country,
    flag: c.flag,
    year: c.year,
    aboveWomen: c.workers_above_lw_women,
    belowWomen: c.workers_below_lw_women,
    aboveMen: c.workers_above_lw_men,
    belowMen: c.workers_below_lw_men,
    genderGapPct: c.gender_gap_pct,
  }));
}

export interface RemunerationByFacility {
  facilityName: string;
  facilityId: string;
  country: string;
  flag: string;
  year: number;
  baseWagePct: number;
  bonusesPct: number;
  inKindPct: number;
  overtimePayPct: number;
}

export function computeRemunerationByFacility(data: WageCalculation[]): RemunerationByFacility[] {
  return data.map(c => ({
    facilityName: c.facility_name,
    facilityId: c.facility_id,
    country: c.country,
    flag: c.flag,
    year: c.year,
    baseWagePct: c.base_wage_pct,
    bonusesPct: c.bonuses_pct,
    inKindPct: c.in_kind_pct,
    overtimePayPct: c.overtime_pay_pct,
  }));
}

export interface OvertimeByFacility {
  facilityName: string;
  facilityId: string;
  country: string;
  flag: string;
  year: number;
  regularHoursWomen: number;
  overtimeHoursWomen: number;
  regularHoursMen: number;
  overtimeHoursMen: number;
  avgWageGapPct: number;
}

export function computeOvertimeByFacility(data: WageCalculation[]): OvertimeByFacility[] {
  return data.map(c => ({
    facilityName: c.facility_name,
    facilityId: c.facility_id,
    country: c.country,
    flag: c.flag,
    year: c.year,
    regularHoursWomen: c.regular_hours_women,
    overtimeHoursWomen: c.overtime_hours_women,
    regularHoursMen: c.regular_hours_men,
    overtimeHoursMen: c.overtime_hours_men,
    avgWageGapPct: c.avg_wage_gap_pct,
  }));
}

export function formatUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function formatNum(n: number): string {
  return n.toLocaleString();
}
