import {
  BarChart3,
  RefreshCw,
  Zap,
  ClipboardCheck,
  Heart,
  Check,
  X,
  Clock,
} from 'lucide-react';
import type { ConsentDetails } from '../../lib/producerStore';

interface Props {
  consent?: ConsentDetails;
  producerAccepted: boolean;
}

function ConsentCell({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-medium leading-tight">{label}</p>
        <div className="text-sm text-gray-800 font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function BooleanIndicator({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
      <Check className="w-3 h-3" strokeWidth={2.5} />
      Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold">
      <X className="w-3 h-3" strokeWidth={2.5} />
      No
    </span>
  );
}

export default function ConsentCard({ consent, producerAccepted }: Props) {
  if (!producerAccepted || !consent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-gray-900 text-sm font-bold">Shared Consent</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Details will appear once the producer accepts the data sharing request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-gray-900 font-bold text-sm">Shared Consent</h3>
        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
          consent.dataGranularity === 'full'
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-blue-50 text-blue-700'
        }`}>
          {consent.dataGranularity === 'full' ? 'Full Data' : 'Aggregated Only'}
        </span>
      </div>
      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
        <ConsentCell
          label="Duration"
          icon={consent.duration === 'ongoing' ? RefreshCw : Zap}
          value={
            <span className="text-xs font-semibold text-gray-700">
              {consent.duration === 'ongoing' ? 'Ongoing' : 'Single period'}
            </span>
          }
        />
        <ConsentCell
          label="Payroll Years"
          icon={BarChart3}
          value={
            <div className="flex items-center gap-1 flex-wrap">
              {consent.payrollYears.map(y => (
                <span
                  key={y}
                  className="inline-flex items-center px-1.5 py-0 rounded bg-gray-100 text-[11px] font-semibold text-gray-600"
                >
                  {y}
                </span>
              ))}
            </div>
          }
        />
        <ConsentCell
          label="Audit Data"
          icon={ClipboardCheck}
          value={<BooleanIndicator value={consent.auditData} />}
        />
        <ConsentCell
          label="Voluntary Contribution"
          icon={Heart}
          value={<BooleanIndicator value={consent.voluntaryContribution} />}
        />
      </div>
    </div>
  );
}
