import { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Info,
  ShieldCheck,
  ClipboardCheck,
  Heart,
  AlertTriangle,
  ChevronDown,
  Check,
  Package,
} from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const AVAILABLE_PAYROLL_YEARS = [
  CURRENT_YEAR,
  CURRENT_YEAR - 1,
  CURRENT_YEAR - 2,
  CURRENT_YEAR - 3,
  CURRENT_YEAR - 4,
];
const DEMO_UNAVAILABLE_YEARS = new Set([CURRENT_YEAR - 4]);

const AVAILABLE_PRODUCTS = [
  'Tea',
  'Coffee',
  'Textiles',
  'Garments',
  'Cocoa',
  'Horticulture',
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface DataPreferences {
  selectedPayrollYears: number[];
  selectedProducts: string[];
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
  requestAuditData: boolean;
  requestVoluntaryContribution: boolean;
}

export const DEFAULT_PREFERENCES: DataPreferences = {
  selectedPayrollYears: [CURRENT_YEAR],
  selectedProducts: [],
  startMonth: 0,
  startYear: CURRENT_YEAR,
  endMonth: CURRENT_MONTH,
  endYear: CURRENT_YEAR,
  requestAuditData: false,
  requestVoluntaryContribution: false,
};

interface Props {
  preferences: DataPreferences;
  onChange: (prefs: DataPreferences) => void;
  matchedCount: number;
  isIntermediary: boolean;
  buyerName?: string;
}

export default function ReportPreferencesStep({
  preferences,
  onChange,
  matchedCount,
  isIntermediary,
  buyerName,
}: Props) {
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [startMonthOpen, setStartMonthOpen] = useState(false);
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [endMonthOpen, setEndMonthOpen] = useState(false);
  const [endYearOpen, setEndYearOpen] = useState(false);

  const update = (partial: Partial<DataPreferences>) =>
    onChange({ ...preferences, ...partial });

  const toggleYear = (year: number) => {
    const current = preferences.selectedPayrollYears;
    const next = current.includes(year)
      ? current.filter(y => y !== year)
      : [...current, year].sort((a, b) => b - a);
    update({ selectedPayrollYears: next });
  };

  const toggleProduct = (product: string) => {
    const current = preferences.selectedProducts;
    const next = current.includes(product)
      ? current.filter(p => p !== product)
      : [...current, product];
    update({ selectedProducts: next });
  };

  const hasUnavailableSelected = preferences.selectedPayrollYears.some(y =>
    DEMO_UNAVAILABLE_YEARS.has(y)
  );

  const accentBorder = isIntermediary ? 'border-primary-300' : 'border-primary-300';
  const accentBg = isIntermediary ? 'bg-primary-50' : 'bg-primary-50';
  const accentRing = isIntermediary ? 'ring-primary-300' : 'ring-primary-300';
  const accentIconBg = isIntermediary ? 'bg-primary-100' : 'bg-primary-100';
  const accentIconText = isIntermediary ? 'text-primary-600' : 'text-primary-600';
  const accentTextStrong = isIntermediary ? 'text-primary-900' : 'text-primary-900';
  const accentTextMid = isIntermediary ? 'text-primary-700' : 'text-primary-700';
  const accentToggle = isIntermediary ? 'bg-primary-600' : 'bg-primary-500';

  const dateYears = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3, CURRENT_YEAR - 4];

  return (
    <div className="space-y-5">
      {isIntermediary && (
        <div className="flex items-start gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
          <Info className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" strokeWidth={1.75} />
          <p className="text-primary-700 text-xs leading-relaxed">
            These data preferences will be shared with <span className="font-bold">{buyerName}</span>.
            The buyer's requested level of data granularity determines what producers are asked to consent to.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <p className="text-gray-700 text-sm font-semibold">What data will be included in the report?</p>
          <p className="text-gray-400 text-xs mt-1">This applies to all {matchedCount} matched producer{matchedCount !== 1 ? 's' : ''}.</p>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-amber-700 text-xs leading-relaxed">
              This selection of data granularity requires consent from producers. Producers will be asked to approve sharing their data before it becomes available.
            </p>
          </div>
        </div>

        <div className="px-5 pb-0 pt-0">
          <div className="border-t border-gray-50 pt-5 pb-5 space-y-4">
            <div>
              <p className="text-gray-700 text-sm font-semibold">Product</p>
              <p className="text-gray-400 text-xs mt-1">
                Select which products/sectors to include in the report.
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProductDropdownOpen(o => !o)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                  <span className={preferences.selectedProducts.length > 0 ? 'text-gray-800' : 'text-gray-400'}>
                    {preferences.selectedProducts.length > 0
                      ? preferences.selectedProducts.join(', ')
                      : 'Select products'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {productDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {AVAILABLE_PRODUCTS.map(product => {
                    const selected = preferences.selectedProducts.includes(product);
                    return (
                      <button
                        key={product}
                        type="button"
                        onClick={() => toggleProduct(product)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition hover:bg-gray-50 ${
                          selected ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                            selected
                              ? `${accentToggle} border-transparent`
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className="text-gray-800 font-medium">{product}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 pb-0 pt-0">
          <div className="border-t border-gray-50 pt-5 pb-5 space-y-4">
            <div>
              <p className="text-gray-700 text-sm font-semibold">Payroll years</p>
              <p className="text-gray-400 text-xs mt-1">
                Payroll year: 1 January &ndash; 31 December. Select which years to request data for.
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setYearDropdownOpen(o => !o)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 transition"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
                  <span className={preferences.selectedPayrollYears.length > 0 ? 'text-gray-800' : 'text-gray-400'}>
                    {preferences.selectedPayrollYears.length > 0
                      ? preferences.selectedPayrollYears.join(', ')
                      : 'Select payroll years'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${yearDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {yearDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {AVAILABLE_PAYROLL_YEARS.map(year => {
                    const selected = preferences.selectedPayrollYears.includes(year);
                    const unavailable = DEMO_UNAVAILABLE_YEARS.has(year);
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => toggleYear(year)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition hover:bg-gray-50 ${
                          selected ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                            selected
                              ? `${accentToggle} border-transparent`
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                          </div>
                          <span className="text-gray-800 font-medium">
                            {year}
                            {year === CURRENT_YEAR && (
                              <span className="text-gray-400 font-normal ml-1.5">(current year)</span>
                            )}
                          </span>
                        </div>
                        {unavailable && (
                          <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                            <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                            Limited data
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {hasUnavailableSelected && (
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                <p className="text-amber-700 text-xs leading-relaxed">
                  Data for some selected years may not be available for all facilities. If a producer has only submitted Salary Matrix data for fewer years, only available years will be shown.
                </p>
              </div>
            )}

            {preferences.selectedPayrollYears.length === 0 && (
              <p className="text-xs text-red-500 font-medium">Please select at least one payroll year.</p>
            )}
          </div>
        </div>

        <div className="px-5 pb-0 pt-0">
          <div className="border-t border-gray-50 pt-5 pb-5 space-y-4">
            <div>
              <p className="text-gray-700 text-sm font-semibold">Request duration</p>
              <p className="text-gray-400 text-xs mt-1">
                Select the start and end date for the data request period.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Start date</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => { setStartMonthOpen(o => !o); setStartYearOpen(false); }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 transition"
                    >
                      <span className="text-gray-800">{MONTHS[preferences.startMonth]}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${startMonthOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {startMonthOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                        {MONTHS.map((month, idx) => (
                          <button
                            key={month}
                            type="button"
                            onClick={() => { update({ startMonth: idx }); setStartMonthOpen(false); }}
                            className={`w-full px-3 py-2 text-sm text-left transition hover:bg-gray-50 ${
                              preferences.startMonth === idx ? 'bg-gray-50 font-medium' : ''
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative w-24">
                    <button
                      type="button"
                      onClick={() => { setStartYearOpen(o => !o); setStartMonthOpen(false); }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 transition"
                    >
                      <span className="text-gray-800">{preferences.startYear}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${startYearOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {startYearOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {dateYears.map(year => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => { update({ startYear: year }); setStartYearOpen(false); }}
                            className={`w-full px-3 py-2 text-sm text-left transition hover:bg-gray-50 ${
                              preferences.startYear === year ? 'bg-gray-50 font-medium' : ''
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">End date</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => { setEndMonthOpen(o => !o); setEndYearOpen(false); }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 transition"
                    >
                      <span className="text-gray-800">{MONTHS[preferences.endMonth]}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${endMonthOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {endMonthOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                        {MONTHS.map((month, idx) => (
                          <button
                            key={month}
                            type="button"
                            onClick={() => { update({ endMonth: idx }); setEndMonthOpen(false); }}
                            className={`w-full px-3 py-2 text-sm text-left transition hover:bg-gray-50 ${
                              preferences.endMonth === idx ? 'bg-gray-50 font-medium' : ''
                            }`}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative w-24">
                    <button
                      type="button"
                      onClick={() => { setEndYearOpen(o => !o); setEndMonthOpen(false); }}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-left hover:border-gray-300 transition"
                    >
                      <span className="text-gray-800">{preferences.endYear}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${endYearOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {endYearOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {dateYears.map(year => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => { update({ endYear: year }); setEndYearOpen(false); }}
                            className={`w-full px-3 py-2 text-sm text-left transition hover:bg-gray-50 ${
                              preferences.endYear === year ? 'bg-gray-50 font-medium' : ''
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-xs text-gray-500 leading-relaxed space-y-1">
                <p>Either party (buyer or producer) may revoke access at any time. Revocation takes effect at the end of the current annual reporting period (31 December).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-gray-50 pt-5 space-y-4">
            <div>
              <p className="text-gray-700 text-sm font-semibold">Additional data requests</p>
              <p className="text-gray-400 text-xs mt-1">
                These require separate consent from {isIntermediary ? 'traders / producers' : 'producers'}.
              </p>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all duration-150 ${
                  preferences.requestAuditData
                    ? `${accentBorder} ${accentBg} ring-1 ${accentRing}`
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  preferences.requestAuditData ? accentIconBg : 'bg-gray-100'
                }`}>
                  <ClipboardCheck className={`w-4 h-4 ${preferences.requestAuditData ? accentIconText : 'text-gray-400'}`} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${preferences.requestAuditData ? accentTextStrong : 'text-gray-800'}`}>
                    Request consent to share data with auditors
                  </p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${preferences.requestAuditData ? accentTextMid : 'text-gray-400'}`}>
                    Request permission to share wage data with third-party auditors for verification purposes.
                  </p>
                  <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${preferences.requestAuditData ? 'text-amber-600' : 'text-gray-400'}`}>
                    <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                    Requires producer consent
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => update({ requestAuditData: !preferences.requestAuditData })}
                  className={`w-11 h-6 rounded-full transition-all duration-200 shrink-0 mt-1 ${
                    preferences.requestAuditData ? accentToggle : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 mx-0.5 ${
                    preferences.requestAuditData ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </label>

              <label
                className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all duration-150 ${
                  preferences.requestVoluntaryContribution
                    ? `${accentBorder} ${accentBg} ring-1 ${accentRing}`
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  preferences.requestVoluntaryContribution ? accentIconBg : 'bg-gray-100'
                }`}>
                  <Heart className={`w-4 h-4 ${preferences.requestVoluntaryContribution ? accentIconText : 'text-gray-400'}`} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${preferences.requestVoluntaryContribution ? accentTextStrong : 'text-gray-800'}`}>
                    Request voluntary Living Wage Contribution
                  </p>
                  <p className={`text-xs mt-0.5 leading-relaxed ${preferences.requestVoluntaryContribution ? accentTextMid : 'text-gray-400'}`}>
                    Request access to voluntary living wage contribution records from matched producers.
                  </p>
                  <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${preferences.requestVoluntaryContribution ? 'text-amber-600' : 'text-gray-400'}`}>
                    <ShieldCheck className="w-3 h-3" strokeWidth={2} />
                    Requires producer consent
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => update({ requestVoluntaryContribution: !preferences.requestVoluntaryContribution })}
                  className={`w-11 h-6 rounded-full transition-all duration-200 shrink-0 mt-1 ${
                    preferences.requestVoluntaryContribution ? accentToggle : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 mx-0.5 ${
                    preferences.requestVoluntaryContribution ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function PreferencesSummary({
  preferences,
  matchedCount,
  isIntermediary,
}: {
  preferences: DataPreferences;
  matchedCount: number;
  isIntermediary: boolean;
}) {
  const extras: string[] = [];
  if (preferences.requestAuditData) extras.push('Share with auditors');
  if (preferences.requestVoluntaryContribution) extras.push('Living Wage Contribution');

  const iconBg = isIntermediary ? 'bg-primary-50' : 'bg-white';
  const iconBorder = isIntermediary ? 'border-primary-100' : 'border-gray-100';

  const dateRange = `${MONTHS_SHORT[preferences.startMonth]} ${preferences.startYear} - ${MONTHS_SHORT[preferences.endMonth]} ${preferences.endYear}`;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 flex items-start gap-3">
      <div className={`w-8 h-8 rounded-lg ${iconBg} border ${iconBorder} flex items-center justify-center shrink-0 mt-0.5`}>
        <Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-700">Summary</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {matchedCount} producer{matchedCount !== 1 ? 's' : ''} &bull;{' '}
          {preferences.selectedProducts.length > 0
            ? preferences.selectedProducts.join(', ')
            : 'All products'} &bull;{' '}
          {preferences.selectedPayrollYears.length > 0
            ? `Payroll ${preferences.selectedPayrollYears.join(', ')}`
            : 'No years selected'} &bull;{' '}
          {dateRange}
          {extras.length > 0 && (
            <> &bull; {extras.join(', ')}</>
          )}
        </p>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          All selections require producer consent before data becomes available.
        </p>
      </div>
    </div>
  );
}
