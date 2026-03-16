export interface WageCalculation {
  id: string;
  facility_name: string;
  facility_id: string;
  country: string;
  region: string;
  flag: string;
  year: number;
  avg_wage_gap_pct: number;
  annual_facility_lwg_usd: number;
  workers_below_lw_pct: number;
  workers_below_lw_count: number;
  total_workers: number;
  lw_estimate_usd: number;
  status: 'Draft' | 'Submitted' | 'Completed' | 'Archived';
  gender_gap_pct: number;
  workers_above_lw_women: number;
  workers_below_lw_women: number;
  workers_above_lw_men: number;
  workers_below_lw_men: number;
  base_wage_pct: number;
  bonuses_pct: number;
  in_kind_pct: number;
  overtime_pay_pct: number;
  regular_hours_women: number;
  overtime_hours_women: number;
  regular_hours_men: number;
  overtime_hours_men: number;
  contributions_cash_usd: number;
  contributions_vouchers_usd: number;
}

export const DEMO_CALCULATIONS: WageCalculation[] = [
  {
    id: '1', facility_name: 'Hanoi Processing Plant', facility_id: 'VI4D08FJ',
    country: 'Vietnam', region: 'Red River Delta', flag: '\u{1F1FB}\u{1F1F3}',
    year: 2024, avg_wage_gap_pct: 22.4, annual_facility_lwg_usd: 312000,
    workers_below_lw_pct: 74.2, workers_below_lw_count: 742, total_workers: 1000,
    lw_estimate_usd: 420, status: 'Submitted', gender_gap_pct: 18.3,
    workers_above_lw_women: 98, workers_below_lw_women: 412,
    workers_above_lw_men: 160, workers_below_lw_men: 330,
    base_wage_pct: 68, bonuses_pct: 12, in_kind_pct: 8, overtime_pay_pct: 12,
    regular_hours_women: 176, overtime_hours_women: 24,
    regular_hours_men: 176, overtime_hours_men: 32,
    contributions_cash_usd: 45000, contributions_vouchers_usd: 12000,
  },
  {
    id: '2', facility_name: 'Hanoi Processing Plant', facility_id: 'VI4D08FJ',
    country: 'Vietnam', region: 'Red River Delta', flag: '\u{1F1FB}\u{1F1F3}',
    year: 2023, avg_wage_gap_pct: 28.1, annual_facility_lwg_usd: 380000,
    workers_below_lw_pct: 80.5, workers_below_lw_count: 805, total_workers: 1000,
    lw_estimate_usd: 390, status: 'Completed', gender_gap_pct: 22.1,
    workers_above_lw_women: 72, workers_below_lw_women: 448,
    workers_above_lw_men: 123, workers_below_lw_men: 357,
    base_wage_pct: 70, bonuses_pct: 10, in_kind_pct: 9, overtime_pay_pct: 11,
    regular_hours_women: 176, overtime_hours_women: 28,
    regular_hours_men: 176, overtime_hours_men: 36,
    contributions_cash_usd: 38000, contributions_vouchers_usd: 9000,
  },
  {
    id: '3', facility_name: 'Accra Cocoa Facility', facility_id: 'GH8D08DI',
    country: 'Ghana', region: 'Greater Accra', flag: '\u{1F1EC}\u{1F1ED}',
    year: 2024, avg_wage_gap_pct: 35.7, annual_facility_lwg_usd: 198000,
    workers_below_lw_pct: 86.4, workers_below_lw_count: 418, total_workers: 484,
    lw_estimate_usd: 310, status: 'Draft', gender_gap_pct: 31.2,
    workers_above_lw_women: 18, workers_below_lw_women: 198,
    workers_above_lw_men: 48, workers_below_lw_men: 220,
    base_wage_pct: 72, bonuses_pct: 8, in_kind_pct: 12, overtime_pay_pct: 8,
    regular_hours_women: 180, overtime_hours_women: 16,
    regular_hours_men: 180, overtime_hours_men: 22,
    contributions_cash_usd: 22000, contributions_vouchers_usd: 8500,
  },
  {
    id: '4', facility_name: 'Accra Cocoa Facility', facility_id: 'GH8D08DI',
    country: 'Ghana', region: 'Greater Accra', flag: '\u{1F1EC}\u{1F1ED}',
    year: 2023, avg_wage_gap_pct: 40.2, annual_facility_lwg_usd: 221000,
    workers_below_lw_pct: 89.7, workers_below_lw_count: 434, total_workers: 484,
    lw_estimate_usd: 290, status: 'Completed', gender_gap_pct: 35.8,
    workers_above_lw_women: 12, workers_below_lw_women: 210,
    workers_above_lw_men: 38, workers_below_lw_men: 224,
    base_wage_pct: 74, bonuses_pct: 7, in_kind_pct: 11, overtime_pay_pct: 8,
    regular_hours_women: 180, overtime_hours_women: 18,
    regular_hours_men: 180, overtime_hours_men: 20,
    contributions_cash_usd: 18000, contributions_vouchers_usd: 6000,
  },
  {
    id: '5', facility_name: 'Mumbai Textile Center', facility_id: 'IN1D08KR',
    country: 'India', region: 'Maharashtra', flag: '\u{1F1EE}\u{1F1F3}',
    year: 2024, avg_wage_gap_pct: 18.9, annual_facility_lwg_usd: 445000,
    workers_below_lw_pct: 61.5, workers_below_lw_count: 1230, total_workers: 2000,
    lw_estimate_usd: 380, status: 'Submitted', gender_gap_pct: 24.6,
    workers_above_lw_women: 246, workers_below_lw_women: 654,
    workers_above_lw_men: 524, workers_below_lw_men: 576,
    base_wage_pct: 65, bonuses_pct: 14, in_kind_pct: 6, overtime_pay_pct: 15,
    regular_hours_women: 172, overtime_hours_women: 28,
    regular_hours_men: 172, overtime_hours_men: 38,
    contributions_cash_usd: 67000, contributions_vouchers_usd: 21000,
  },
  {
    id: '6', facility_name: 'Mumbai Textile Center', facility_id: 'IN1D08KR',
    country: 'India', region: 'Maharashtra', flag: '\u{1F1EE}\u{1F1F3}',
    year: 2023, avg_wage_gap_pct: 21.3, annual_facility_lwg_usd: 498000,
    workers_below_lw_pct: 69.0, workers_below_lw_count: 1380, total_workers: 2000,
    lw_estimate_usd: 355, status: 'Completed', gender_gap_pct: 27.4,
    workers_above_lw_women: 192, workers_below_lw_women: 708,
    workers_above_lw_men: 428, workers_below_lw_men: 672,
    base_wage_pct: 67, bonuses_pct: 12, in_kind_pct: 7, overtime_pay_pct: 14,
    regular_hours_women: 172, overtime_hours_women: 32,
    regular_hours_men: 172, overtime_hours_men: 40,
    contributions_cash_usd: 59000, contributions_vouchers_usd: 18000,
  },
  {
    id: '7', facility_name: 'Sao Paulo Manufacturing', facility_id: 'BR8D08UN',
    country: 'Brazil', region: 'Sao Paulo', flag: '\u{1F1E7}\u{1F1F7}',
    year: 2024, avg_wage_gap_pct: 10.4, annual_facility_lwg_usd: 720000,
    workers_below_lw_pct: 86.4, workers_below_lw_count: 864, total_workers: 1002,
    lw_estimate_usd: 800, status: 'Draft', gender_gap_pct: 12.8,
    workers_above_lw_women: 52, workers_below_lw_women: 378,
    workers_above_lw_men: 86, workers_below_lw_men: 486,
    base_wage_pct: 60, bonuses_pct: 18, in_kind_pct: 5, overtime_pay_pct: 17,
    regular_hours_women: 168, overtime_hours_women: 12,
    regular_hours_men: 168, overtime_hours_men: 20,
    contributions_cash_usd: 95000, contributions_vouchers_usd: 31000,
  },
  {
    id: '8', facility_name: 'Sao Paulo Manufacturing', facility_id: 'BR8D08UN',
    country: 'Brazil', region: 'Sao Paulo', flag: '\u{1F1E7}\u{1F1F7}',
    year: 2023, avg_wage_gap_pct: 13.2, annual_facility_lwg_usd: 860000,
    workers_below_lw_pct: 89.9, workers_below_lw_count: 901, total_workers: 1002,
    lw_estimate_usd: 760, status: 'Completed', gender_gap_pct: 15.3,
    workers_above_lw_women: 38, workers_below_lw_women: 392,
    workers_above_lw_men: 63, workers_below_lw_men: 509,
    base_wage_pct: 62, bonuses_pct: 16, in_kind_pct: 6, overtime_pay_pct: 16,
    regular_hours_women: 168, overtime_hours_women: 14,
    regular_hours_men: 168, overtime_hours_men: 22,
    contributions_cash_usd: 87000, contributions_vouchers_usd: 28000,
  },
  {
    id: '9', facility_name: 'Dhaka Garment Factory', facility_id: 'BA0D08NR',
    country: 'Bangladesh', region: 'Dhaka Division', flag: '\u{1F1E7}\u{1F1E9}',
    year: 2024, avg_wage_gap_pct: 41.5, annual_facility_lwg_usd: 534000,
    workers_below_lw_pct: 91.8, workers_below_lw_count: 2870, total_workers: 3125,
    lw_estimate_usd: 195, status: 'Submitted', gender_gap_pct: 38.7,
    workers_above_lw_women: 48, workers_below_lw_women: 1752,
    workers_above_lw_men: 207, workers_below_lw_men: 1118,
    base_wage_pct: 78, bonuses_pct: 6, in_kind_pct: 4, overtime_pay_pct: 12,
    regular_hours_women: 182, overtime_hours_women: 36,
    regular_hours_men: 182, overtime_hours_men: 42,
    contributions_cash_usd: 31000, contributions_vouchers_usd: 14000,
  },
  {
    id: '10', facility_name: 'Dhaka Garment Factory', facility_id: 'BA0D08NR',
    country: 'Bangladesh', region: 'Dhaka Division', flag: '\u{1F1E7}\u{1F1E9}',
    year: 2023, avg_wage_gap_pct: 47.2, annual_facility_lwg_usd: 612000,
    workers_below_lw_pct: 95.0, workers_below_lw_count: 2969, total_workers: 3125,
    lw_estimate_usd: 180, status: 'Completed', gender_gap_pct: 43.1,
    workers_above_lw_women: 28, workers_below_lw_women: 1802,
    workers_above_lw_men: 128, workers_below_lw_men: 1167,
    base_wage_pct: 80, bonuses_pct: 5, in_kind_pct: 4, overtime_pay_pct: 11,
    regular_hours_women: 182, overtime_hours_women: 40,
    regular_hours_men: 182, overtime_hours_men: 44,
    contributions_cash_usd: 25000, contributions_vouchers_usd: 10000,
  },
  {
    id: '11', facility_name: 'Nairobi Food Processing', facility_id: 'KE6D08KM',
    country: 'Kenya', region: 'Nairobi County', flag: '\u{1F1F0}\u{1F1EA}',
    year: 2024, avg_wage_gap_pct: 29.6, annual_facility_lwg_usd: 167000,
    workers_below_lw_pct: 76.8, workers_below_lw_count: 384, total_workers: 500,
    lw_estimate_usd: 260, status: 'Draft', gender_gap_pct: 26.4,
    workers_above_lw_women: 34, workers_below_lw_women: 186,
    workers_above_lw_men: 82, workers_below_lw_men: 198,
    base_wage_pct: 71, bonuses_pct: 9, in_kind_pct: 10, overtime_pay_pct: 10,
    regular_hours_women: 176, overtime_hours_women: 20,
    regular_hours_men: 176, overtime_hours_men: 26,
    contributions_cash_usd: 19000, contributions_vouchers_usd: 7500,
  },
  {
    id: '12', facility_name: 'Nairobi Food Processing', facility_id: 'KE6D08KM',
    country: 'Kenya', region: 'Nairobi County', flag: '\u{1F1F0}\u{1F1EA}',
    year: 2023, avg_wage_gap_pct: 33.1, annual_facility_lwg_usd: 191000,
    workers_below_lw_pct: 82.0, workers_below_lw_count: 410, total_workers: 500,
    lw_estimate_usd: 245, status: 'Completed', gender_gap_pct: 29.8,
    workers_above_lw_women: 26, workers_below_lw_women: 194,
    workers_above_lw_men: 64, workers_below_lw_men: 216,
    base_wage_pct: 73, bonuses_pct: 8, in_kind_pct: 10, overtime_pay_pct: 9,
    regular_hours_women: 176, overtime_hours_women: 22,
    regular_hours_men: 176, overtime_hours_men: 28,
    contributions_cash_usd: 15000, contributions_vouchers_usd: 5500,
  },
  {
    id: '13', facility_name: 'Jakarta Apparel Plant', facility_id: 'ID2D08JS',
    country: 'Indonesia', region: 'DKI Jakarta', flag: '\u{1F1EE}\u{1F1E9}',
    year: 2024, avg_wage_gap_pct: 25.3, annual_facility_lwg_usd: 289000,
    workers_below_lw_pct: 69.6, workers_below_lw_count: 1044, total_workers: 1500,
    lw_estimate_usd: 290, status: 'Submitted', gender_gap_pct: 21.7,
    workers_above_lw_women: 168, workers_below_lw_women: 582,
    workers_above_lw_men: 288, workers_below_lw_men: 462,
    base_wage_pct: 66, bonuses_pct: 13, in_kind_pct: 7, overtime_pay_pct: 14,
    regular_hours_women: 174, overtime_hours_women: 22,
    regular_hours_men: 174, overtime_hours_men: 30,
    contributions_cash_usd: 42000, contributions_vouchers_usd: 11000,
  },
  {
    id: '14', facility_name: 'Colombo Rubber Works', facility_id: 'LK5D08CL',
    country: 'Sri Lanka', region: 'Western Province', flag: '\u{1F1F1}\u{1F1F0}',
    year: 2024, avg_wage_gap_pct: 16.2, annual_facility_lwg_usd: 142000,
    workers_below_lw_pct: 55.2, workers_below_lw_count: 497, total_workers: 900,
    lw_estimate_usd: 310, status: 'Draft', gender_gap_pct: 13.9,
    workers_above_lw_women: 142, workers_below_lw_women: 208,
    workers_above_lw_men: 261, workers_below_lw_men: 289,
    base_wage_pct: 64, bonuses_pct: 15, in_kind_pct: 8, overtime_pay_pct: 13,
    regular_hours_women: 170, overtime_hours_women: 14,
    regular_hours_men: 170, overtime_hours_men: 18,
    contributions_cash_usd: 28000, contributions_vouchers_usd: 9000,
  },
  {
    id: '15', facility_name: 'Colombo Rubber Works', facility_id: 'LK5D08CL',
    country: 'Sri Lanka', region: 'Western Province', flag: '\u{1F1F1}\u{1F1F0}',
    year: 2023, avg_wage_gap_pct: 19.4, annual_facility_lwg_usd: 168000,
    workers_below_lw_pct: 59.3, workers_below_lw_count: 534, total_workers: 900,
    lw_estimate_usd: 290, status: 'Completed', gender_gap_pct: 16.5,
    workers_above_lw_women: 124, workers_below_lw_women: 226,
    workers_above_lw_men: 242, workers_below_lw_men: 308,
    base_wage_pct: 66, bonuses_pct: 14, in_kind_pct: 8, overtime_pay_pct: 12,
    regular_hours_women: 170, overtime_hours_women: 16,
    regular_hours_men: 170, overtime_hours_men: 20,
    contributions_cash_usd: 23000, contributions_vouchers_usd: 7000,
  },
];

export const FLAG_MAP: Record<string, string> = {
  Vietnam: '\u{1F1FB}\u{1F1F3}',
  Ghana: '\u{1F1EC}\u{1F1ED}',
  India: '\u{1F1EE}\u{1F1F3}',
  Brazil: '\u{1F1E7}\u{1F1F7}',
  Bangladesh: '\u{1F1E7}\u{1F1E9}',
  Kenya: '\u{1F1F0}\u{1F1EA}',
  Indonesia: '\u{1F1EE}\u{1F1E9}',
  'Sri Lanka': '\u{1F1F1}\u{1F1F0}',
};
