import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProducerTable from '../components/ProducerTable';
import { useProducerStore, Producer, ProducerStatus } from '../lib/producerStore';
import { useDemoStore } from '../lib/demoStore';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Calendar,
  ChevronRight,
  Lock,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import ProducerDetailKpiCards from './producer-detail/KpiCards';
import ConsentCard from './producer-detail/ConsentCard';
import ProducerLivingWageTable from './producer-detail/ProducerLivingWageTable';

function ProducerStatusIcon({ status }: { status: ProducerStatus }) {
  switch (status) {
    case 'invited':
      return <Mail className="w-5 h-5 text-blue-500" strokeWidth={1.75} />;
    case 'accepted':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={1.75} />;
    case 'declined':
      return <XCircle className="w-5 h-5 text-red-500" strokeWidth={1.75} />;
    case 'pending':
      return <Clock className="w-5 h-5 text-gray-400" strokeWidth={1.75} />;
  }
}

function ProducerStatusLabel({ status }: { status: ProducerStatus }) {
  const map: Record<ProducerStatus, { label: string; color: string }> = {
    invited: { label: 'Invited \u2014 awaiting response', color: 'text-blue-600' },
    accepted: { label: 'Accepted', color: 'text-emerald-600' },
    declined: { label: 'Declined', color: 'text-red-600' },
    pending: { label: 'Pending', color: 'text-gray-500' },
  };
  const { label, color } = map[status];
  return <span className={`text-sm font-semibold ${color}`}>{label}</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function EditableName({
  producerId,
  name,
  isBuyer,
}: {
  producerId: string;
  name: string;
  isBuyer: boolean;
}) {
  const { updateProducerName } = useProducerStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  if (!isBuyer) {
    return <h2 className="text-gray-900 text-lg font-bold">{name}</h2>;
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2 group">
        <h2 className="text-gray-900 text-lg font-bold">{name}</h2>
        <button
          onClick={() => { setDraft(name); setEditing(true); }}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-500 hover:bg-gray-100 transition-all"
          title="Edit company name"
        >
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && draft.trim()) {
            updateProducerName(producerId, draft.trim());
            setEditing(false);
          }
          if (e.key === 'Escape') setEditing(false);
        }}
        className="text-lg font-bold text-gray-900 border border-gray-200 rounded-lg px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 bg-gray-50"
      />
      <button
        onClick={() => {
          if (draft.trim()) {
            updateProducerName(producerId, draft.trim());
            setEditing(false);
          }
        }}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition"
      >
        <Check className="w-4 h-4" strokeWidth={2} />
      </button>
      <button
        onClick={() => setEditing(false)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
}

function RestrictedAccessCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-gray-900 font-bold text-sm">Living Wage Gap Calculations</h3>
      </div>
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
        </div>
        <p className="text-gray-700 text-sm font-semibold">Restricted access</p>
        <p className="text-gray-400 text-xs mt-1.5 text-center max-w-xs leading-relaxed">
          Living Wage Gap Calculation data is only visible to buyers. As an intermediary, your role is to match producers with buyers.
        </p>
      </div>
    </div>
  );
}

function ProducerDetailView({ producer }: { producer: Producer }) {
  const navigate = useNavigate();
  const { activeRole } = useDemoStore();
  const isBuyer = activeRole === 'buyer';
  const isIntermediary = activeRole === 'intermediary';

  const facilityData = producer.facilities.map(f => ({
    facilityId: f.facilityId,
    salaryMatrixStatus: f.salaryMatrixStatus,
  }));

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/producers')}
        className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        All producers
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary-600">{producer.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <EditableName producerId={producer.id} name={producer.name} isBuyer={isBuyer} />
                <p className="text-gray-400 text-sm mt-0.5">{producer.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <ProducerStatusIcon status={producer.status} />
                <ProducerStatusLabel status={producer.status} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Building2 className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                <span className="font-semibold text-gray-700">{producer.facilitiesCount}</span>
                {producer.facilitiesCount === 1 ? 'facility' : 'facilities'} requested
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                Invited {formatDate(producer.invitedAt)}
                {producer.invitedBy && (
                  <span className="text-gray-400">by {producer.invitedBy}</span>
                )}
              </div>
              {producer.respondedAt && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" strokeWidth={1.75} />
                  Responded {formatDate(producer.respondedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProducerDetailKpiCards facilities={facilityData} />

      {producer.status === 'declined' && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-semibold text-red-700">Producer declined the request</p>
            <p className="text-xs text-red-600 mt-1 leading-relaxed">
              This producer chose not to participate. You can reach out directly or remove them from your list.
            </p>
            <div className="mt-3 bg-white border border-red-100 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Reason provided</p>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "We are not in a position to share wage data with external parties at this time. Please revisit this request in the next reporting cycle."
              </p>
            </div>
          </div>
        </div>
      )}

      {producer.status === 'invited' && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
          <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-semibold text-blue-700">Waiting for response</p>
            <p className="text-xs text-blue-600 mt-1 leading-relaxed">
              An invitation email has been sent. The producer hasn't responded yet.
            </p>
          </div>
        </div>
      )}

      {isBuyer && <ConsentCard consent={producer.consent} producerAccepted={producer.status === 'accepted'} />}

      {isIntermediary ? <RestrictedAccessCard /> : <ProducerLivingWageTable facilities={producer.facilities} />}
    </div>
  );
}

export default function ProducersPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { producers } = useProducerStore();

  const selectedProducer = id ? producers.find(p => p.id === id) : null;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-5xl mx-auto space-y-6">
          {!selectedProducer && !id && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-gray-900 text-xl font-bold">Producers</h1>
                  <p className="text-gray-400 text-xs mt-0.5">
                    All producers in your supply chain.
                  </p>
                </div>
              </div>
              <ProducerTable
                producers={producers}
                onAddProducer={() => navigate('/add-producer')}
              />
            </>
          )}

          {selectedProducer && <ProducerDetailView producer={selectedProducer} />}

          {id && !selectedProducer && (
            <div className="text-center py-20 space-y-3">
              <p className="text-gray-500 text-sm">Producer not found.</p>
              <button
                onClick={() => navigate('/producers')}
                className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
              >
                Back to producers
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
