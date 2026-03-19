import Sidebar from '../../components/Sidebar';
import { Building2, Pencil, CheckCircle2, Eye, Info, MoreVertical } from 'lucide-react';

const STAT_CARDS = [
  { label: 'Facilities Created', value: 4, icon: Building2, iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
  { label: 'Calculations in Draft', value: 2, icon: Pencil, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { label: 'Completed Reports', value: 8, icon: CheckCircle2, iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
  { label: 'In Audit', value: 1, icon: Eye, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
];

const COUNTRY_FLAGS: Record<string, string> = {
  Vietnam: '\u{1F1FB}\u{1F1F3}',
  Ghana: '\u{1F1EC}\u{1F1ED}',
  India: '\u{1F1EE}\u{1F1F3}',
  Brazil: '\u{1F1E7}\u{1F1F7}',
  Bangladesh: '\u{1F1E7}\u{1F1E9}',
  Kenya: '\u{1F1F0}\u{1F1EA}',
};

const FACILITIES = [
  { country: 'Vietnam', name: 'Hanoi Processing Plant', facilityId: 'VI4D08FJ', linked: 2 },
  { country: 'Ghana', name: 'Accra Cocoa Facility', facilityId: 'GH4D08FJ', linked: 1 },
  { country: 'India', name: 'Mumbai Textile Center', facilityId: 'VI4D08FJ', linked: 0 },
];

type CalcStatus = 'Draft' | 'Submitted' | 'Archived';

interface WageCalcRow {
  facilityName: string;
  facilitySubId: string;
  id: string;
  country: string;
  year: number;
  status: CalcStatus;
  progress: number | null;
  lastUpdated: string;
}

const WAGE_CALC_ROWS: WageCalcRow[] = [
  { facilityName: 'Hanoi Processing Plant', facilitySubId: 'VI4D08FJ', id: 'WCAB123', country: 'Vietnam', year: 2024, status: 'Draft', progress: 60, lastUpdated: '2 days ago' },
  { facilityName: 'Accra Cocoa Facility', facilitySubId: 'GH8D08DI', id: 'WCAB456', country: 'Ghana', year: 2023, status: 'Submitted', progress: null, lastUpdated: '1 week ago' },
  { facilityName: 'Mumbai Textile Center', facilitySubId: 'IN1D08KR', id: 'WCAB789', country: 'India', year: 2024, status: 'Draft', progress: null, lastUpdated: '3 days ago' },
  { facilityName: 'Sao Paulo Manufacturing', facilitySubId: 'BR8D08UN', id: 'WCAB234', country: 'Brazil', year: 2024, status: 'Draft', progress: 38, lastUpdated: '5 days ago' },
  { facilityName: 'Dhaka Garment Factory', facilitySubId: 'BA0D08NR', id: 'WCAB456', country: 'Bangladesh', year: 2023, status: 'Submitted', progress: null, lastUpdated: '2 weeks ago' },
  { facilityName: 'Nairobi Food Processing', facilitySubId: 'KE6D08KM', id: 'WCAB567', country: 'Kenya', year: 2022, status: 'Archived', progress: null, lastUpdated: '6 months ago' },
];

function StatusBadge({ status }: { status: CalcStatus }) {
  const config: Record<CalcStatus, { bg: string; text: string }> = {
    Draft: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    Submitted: { bg: 'bg-primary-50 border-primary-200', text: 'text-primary-700' },
    Archived: { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-500' },
  };
  const { bg, text } = config[status];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${text}`}>
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-300 text-sm">&ndash;</span>;
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-600">{value}</span>
    </div>
  );
}

function FacilityCardDecoration() {
  return (
    <div className="h-20 bg-gradient-to-br from-primary-600 to-primary-700 relative overflow-hidden rounded-t-xl">
      <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 40 Q30 10 60 30 Q90 50 120 25 Q150 0 180 20 Q210 40 240 15 Q270 -5 300 20 L300 60 L0 60 Z" fill="rgba(255,255,255,0.1)" />
        <path d="M0 50 Q40 30 80 45 Q120 60 160 35 Q200 10 240 30 Q270 45 300 35 L300 60 L0 60 Z" fill="rgba(255,255,255,0.07)" />
      </svg>
      <div className="absolute top-3 right-3 flex gap-1">
        {[24, 32, 20].map((h, i) => (
          <div key={i} className="w-3 bg-white bg-opacity-15 rounded-sm" style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

export default function SupplierDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm">
              Start Measuring Gaps
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-10">
            {STAT_CARDS.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <p className="text-gray-500 text-xs font-medium">{label}</p>
                    <Info className="w-3 h-3 text-gray-300" strokeWidth={1.75} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.75} />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Edited Facilities</h2>
              <button className="text-sm font-semibold text-primary-700 hover:text-primary-800 transition">See All</button>
            </div>
            <div className="grid grid-cols-3 gap-5">
              {FACILITIES.map(f => (
                <div key={f.facilityId + f.name} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <FacilityCardDecoration />
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{COUNTRY_FLAGS[f.country]}</span>
                      <span className="text-xs font-medium text-gray-500">{f.country}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-3">{f.name}</p>
                    <div className="flex items-center gap-6 text-xs text-gray-400">
                      <div>
                        <span className="text-gray-400 font-medium">Facility ID</span>
                        <p className="text-gray-600 font-semibold mt-0.5"># {f.facilityId}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Linked</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-gray-600 font-semibold">{f.linked}</span>
                          <Building2 className="w-3 h-3 text-gray-400" strokeWidth={1.75} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Living Wage Calculations</h2>
              <button className="text-sm font-semibold text-primary-700 hover:text-primary-800 transition">See All</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Facilities</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Payroll Year</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Progress</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Last Updated</th>
                      <th className="px-3 py-3.5 w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {WAGE_CALC_ROWS.map(row => (
                      <tr key={row.id + row.facilityName} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-800">{row.facilityName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{row.facilitySubId}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 font-medium">{row.id}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{COUNTRY_FLAGS[row.country]}</span>
                            <span className="text-sm text-gray-600">{row.country}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{row.year}</td>
                        <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                        <td className="px-4 py-4"><ProgressBar value={row.progress} /></td>
                        <td className="px-4 py-4 text-xs text-gray-400">{row.lastUpdated}</td>
                        <td className="px-3 py-4">
                          <button className="p-1 rounded hover:bg-gray-100 transition">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 border-t border-gray-100">
                <p className="text-xs text-primary-700 font-medium">Page 1 of 1</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
