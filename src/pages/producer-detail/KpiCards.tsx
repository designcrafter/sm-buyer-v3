import {
  Building2,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import type { SalaryMatrixStatus } from '../../lib/producerStore';

interface FacilityRow {
  salaryMatrixStatus: SalaryMatrixStatus;
}

interface Props {
  facilities: FacilityRow[];
}

export default function ProducerDetailKpiCards({ facilities }: Props) {
  const totalFacilities = facilities.length;
  const submitted = facilities.filter(f => f.salaryMatrixStatus === 'submitted').length;
  const inProgress = facilities.filter(f => f.salaryMatrixStatus === 'in_progress').length;
  const missing = facilities.filter(f => f.salaryMatrixStatus === 'missing').length;

  const cards = [
    {
      label: 'Facilities Connected',
      value: totalFacilities,
      icon: Building2,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      label: 'SM Submitted',
      value: submitted,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'SM In Progress',
      value: inProgress,
      icon: Loader2,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      label: 'SM Missing',
      value: missing,
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-3"
        >
          <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
            <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
