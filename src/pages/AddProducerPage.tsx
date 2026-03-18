import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducerStore } from '../lib/producerStore';
import { useDemoStore } from '../lib/demoStore';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Download,
  Factory,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Loader2,
  AlertTriangle,
  Pencil,
  Check,
  ChevronRight,
  Database,
  ArrowRight,
  Send,
  Link2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Sidebar from '../components/Sidebar';
import ReportPreferencesStep, {
  PreferencesSummary,
  DEFAULT_PREFERENCES,
  type DataPreferences,
} from '../components/ReportPreferencesStep';

interface ProducerRow {
  id: string;
  facilityId: string;
  email: string;
}

interface CheckedRow extends ProducerRow {
  status: 'pending' | 'checking' | 'matched' | 'unmatched';
  editingFacilityId?: string;
  editingEmail?: string;
  isEditing?: boolean;
}

type Tab = 'manual' | 'bulk';
type FlowStep = 'buyer-select' | 'entry' | 'checking' | 'preferences' | 'done';

function newRow(): ProducerRow {
  return { id: crypto.randomUUID(), facilityId: '', email: '' };
}

const DEMO_ENTRIES = [
  { facilityId: 'FAC-001', email: 'ops@sunrise-textiles.com' },
  { facilityId: 'FAC-002', email: 'compliance@deltaweave.co' },
  { facilityId: 'FAC-003', email: 'contact@meridiangarments.com' },
  { facilityId: 'FAC-004', email: 'info@bluethread-factory.com' },
  { facilityId: 'FAC-005', email: 'sourcing@peakfabrics.net' },
  { facilityId: 'FAC-006', email: 'admin@goldenstitchltd.com' },
  { facilityId: 'FAC-007', email: 'ops@coastlinemanufacturing.com' },
  { facilityId: 'FAC-008', email: 'contact@horizonapparel.co' },
  { facilityId: 'FAC-009', email: 'team@verdantgarments.net' },
  { facilityId: 'FAC-010', email: 'info@arcticweave.com' },
  { facilityId: 'FAC-011', email: 'ops@stonebridgetextiles.com' },
  { facilityId: 'FAC-012', email: 'compliance@easternloom.co' },
  { facilityId: 'FAC-013', email: 'contact@novalinefactory.com' },
  { facilityId: 'FAC-014', email: 'sourcing@crestviewsupply.net' },
  { facilityId: 'FAC-015', email: 'admin@terrafirmafabrics.com' },
  { facilityId: 'FAC-016', email: 'ops@silvermoongarments.co' },
  { facilityId: 'FAC-017', email: 'info@harvesttextilegroup.com' },
  { facilityId: 'FAC-018', email: 'team@mountainweaveind.net' },
  { facilityId: 'FAC-019', email: 'contact@urbanstitchworks.com' },
  { facilityId: 'FAC-020', email: 'ops@clearwaterfabrics.co' },
];

const UNMATCHED_INDICES = [4, 11];

export default function AddProducerPage() {
  const navigate = useNavigate();
  const { activeRole, allBuyers } = useDemoStore();
  const isIntermediary = activeRole === 'intermediary';
  const [tab, setTab] = useState<Tab>('bulk');
  const [rows, setRows] = useState<ProducerRow[]>([newRow()]);
  const [bulkRows, setBulkRows] = useState<ProducerRow[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkParseError, setBulkParseError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedBuyerId, setSelectedBuyerId] = useState<string>('');
  const [step, setStep] = useState<FlowStep>(isIntermediary ? 'buyer-select' : 'entry');
  const [checkedRows, setCheckedRows] = useState<CheckedRow[]>([]);
  const checkingListRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [preferences, setPreferences] = useState<DataPreferences>(DEFAULT_PREFERENCES);
  const [submitted, setSubmitted] = useState(false);
  const { addProducers } = useProducerStore();
  const dashboardPath = isIntermediary ? '/intermediary/dashboard' : '/dashboard';

  const selectedBuyer = allBuyers.find(b => b.id === selectedBuyerId);

  function addRow() {
    setRows(r => [...r, newRow()]);
  }

  function removeRow(id: string) {
    setRows(r => r.length === 1 ? r : r.filter(row => row.id !== id));
  }

  function updateRow(id: string, field: 'facilityId' | 'email', value: string) {
    setRows(r => r.map(row => row.id === id ? { ...row, [field]: value } : row));
  }

  function downloadTemplate() {
    const wb = XLSX.utils.book_new();
    const header = [['Facility ID', 'Email']];
    const dataRows = DEMO_ENTRIES.map(e => [e.facilityId, e.email]);
    const ws = XLSX.utils.aoa_to_sheet([...header, ...dataRows]);
    ws['!cols'] = [{ wch: 20 }, { wch: 35 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Producers');
    XLSX.writeFile(wb, 'producers_template.xlsx');
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkParseError('');
    setBulkRows([]);
    setBulkFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' });

        if (json.length === 0) {
          setBulkParseError('The file appears to be empty.');
          return;
        }

        const parsed: ProducerRow[] = json.map((r) => {
          const facilityId = (r['Facility ID'] ?? r['facility_id'] ?? r['facilityId'] ?? '').toString().trim();
          const email = (r['Email'] ?? r['email'] ?? '').toString().trim();
          return { id: crypto.randomUUID(), facilityId, email };
        });

        setBulkRows(parsed);
      } catch {
        setBulkParseError('Could not parse the file. Please use the provided template.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  }

  function removeBulkRow(id: string) {
    setBulkRows(r => r.filter(row => row.id !== id));
  }

  function startChecking() {
    const source = tab === 'manual' ? rows : bulkRows;
    const valid = source.filter(r => r.facilityId.trim() && r.email.trim());
    if (valid.length === 0) return;

    const initial: CheckedRow[] = valid.map(r => ({ ...r, status: 'pending' }));
    setCheckedRows(initial);
    setStep('checking');
  }

  const scrollRowIntoView = useCallback((id: string) => {
    const el = rowRefs.current.get(id);
    const container = checkingListRef.current;
    if (!el || !container) return;
    const elTop = el.offsetTop;
    const elBottom = elTop + el.offsetHeight;
    const visible = container.scrollTop + container.clientHeight;
    if (elBottom > visible || elTop < container.scrollTop) {
      container.scrollTo({ top: elTop - container.clientHeight / 2 + el.offsetHeight / 2, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (step !== 'checking') return;

    const total = checkedRows.length;
    let current = 0;
    let cancelled = false;

    function checkNext() {
      if (cancelled || current >= total) return;

      const id = checkedRows[current].id;

      setCheckedRows(prev =>
        prev.map(r => r.id === id ? { ...r, status: 'checking' } : r)
      );
      setTimeout(() => scrollRowIntoView(id), 30);

      const delay = 400 + Math.random() * 500;

      setTimeout(() => {
        if (cancelled) return;
        const isUnmatched = UNMATCHED_INDICES.includes(current);
        setCheckedRows(prev =>
          prev.map(r => r.id === id ? { ...r, status: isUnmatched ? 'unmatched' : 'matched' } : r)
        );
        current++;
        setTimeout(checkNext, 150);
      }, delay);
    }

    const t = setTimeout(checkNext, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [step]);

  function startEditRow(id: string) {
    setCheckedRows(prev =>
      prev.map(r => r.id === id
        ? { ...r, isEditing: true, editingFacilityId: r.facilityId, editingEmail: r.email }
        : r
      )
    );
  }

  function updateEditRow(id: string, field: 'editingFacilityId' | 'editingEmail', value: string) {
    setCheckedRows(prev =>
      prev.map(r => r.id === id ? { ...r, [field]: value } : r)
    );
  }

  function saveEditRow(id: string) {
    setCheckedRows(prev =>
      prev.map(r => r.id === id
        ? {
            ...r,
            facilityId: r.editingFacilityId ?? r.facilityId,
            email: r.editingEmail ?? r.email,
            isEditing: false,
            status: 'matched',
          }
        : r
      )
    );
  }

  function removeCheckedRow(id: string) {
    setCheckedRows(prev => prev.filter(r => r.id !== id));
  }

  const allDoneChecking = checkedRows.length > 0 && checkedRows.every(r => r.status === 'matched' || r.status === 'unmatched');
  const matchedCount = checkedRows.filter(r => r.status === 'matched').length;
  const unmatchedCount = checkedRows.filter(r => r.status === 'unmatched').length;

  async function handleRequestReport() {
    setSubmitted(true);
    const matched = checkedRows.filter(r => r.status === 'matched');
    const matchedRows = matched.map(r => ({
      facilityId: r.facilityId.trim(),
      email: r.email.trim(),
    }));
    if (isIntermediary && selectedBuyerId && selectedBuyer) {
      addProducers(matchedRows, selectedBuyerId, selectedBuyer.name);
    } else {
      addProducers(matchedRows, 'buyer-default', 'Default Buyer');
    }
    setStep('done');
  }

  if (step === 'done') {
    return (
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-5 max-w-sm px-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${isIntermediary ? 'bg-teal-50 border border-teal-100' : 'bg-emerald-50 border border-emerald-100'}`}>
              {isIntermediary
                ? <Link2 className="w-8 h-8 text-teal-500" strokeWidth={1.5} />
                : <CheckCircle2 className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
              }
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-base">
                {isIntermediary ? 'Producers matched successfully' : 'Report requested successfully'}
              </p>
              <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
                {isIntermediary && selectedBuyer
                  ? `${matchedCount} producer${matchedCount !== 1 ? 's have' : ' has'} been matched for ${selectedBuyer.name} with your data preferences. They have been notified.`
                  : isIntermediary
                  ? `${matchedCount} producer${matchedCount !== 1 ? 's have' : ' has'} been matched with your data preferences. They have been notified.`
                  : 'Your Living Wage Gap Calculation Report has been submitted. IDH will process this and get back to you.'
                }
              </p>
            </div>
            <button
              onClick={() => navigate(dashboardPath)}
              className={`flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl transition mx-auto ${isIntermediary ? 'bg-teal-600 hover:bg-teal-700' : 'bg-primary-500 hover:bg-primary-600'}`}
            >
              Back to dashboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (step === 'buyer-select' || step === 'entry') {
                  navigate(dashboardPath);
                } else if (step === 'checking') {
                  setStep('entry');
                } else if (step === 'preferences') {
                  setStep('checking');
                }
              }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 'buyer-select' || step === 'entry' ? 'Back' : step === 'checking' ? 'Back to entry' : 'Back'}
            </button>
          </div>

          <StepIndicator step={step} isIntermediary={isIntermediary} />

          {isIntermediary && selectedBuyer && step !== 'buyer-select' && (
            <div className="flex items-center gap-2.5 bg-teal-50 border border-teal-100 rounded-xl px-4 py-3">
              <Link2 className="w-4 h-4 text-teal-500 shrink-0" strokeWidth={1.75} />
              <p className="text-teal-700 text-xs font-medium">
                Matching producers for <span className="font-bold">{selectedBuyer.name}</span>
              </p>
            </div>
          )}

          <div className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isIntermediary ? 'bg-teal-50' : 'bg-primary-50'}`}>
              <Factory className={`w-5 h-5 ${isIntermediary ? 'text-teal-600' : 'text-primary-600'}`} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-gray-900 text-xl font-bold">
                {step === 'buyer-select' && 'Select Buyer'}
                {step === 'entry' && (isIntermediary ? 'Match Producers' : 'Invite Producers')}
                {step === 'checking' && 'Checking Producer Details'}
                {step === 'preferences' && 'Report Preferences'}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {step === 'buyer-select' && 'Choose which buyer you are matching producers for.'}
                {step === 'entry' && 'Enter facilities manually or upload a spreadsheet.'}
                {step === 'checking' && 'Checking each facility against the Salary Matrix database.'}
                {step === 'preferences' && (isIntermediary && selectedBuyer
                  ? `Configure data preferences on behalf of ${selectedBuyer.name}.`
                  : isIntermediary
                  ? 'Configure data preferences for your matched producers.'
                  : 'Choose what data you want for the Living Wage Gap report.'
                )}
              </p>
            </div>
          </div>

          {step === 'buyer-select' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <p className="text-gray-700 text-sm font-semibold">Select a buyer</p>
                  <p className="text-gray-400 text-xs mt-0.5">Choose which buyer you are matching producers for.</p>
                </div>
                <div className="p-6 space-y-3">
                  {allBuyers.map(buyer => (
                    <button
                      key={buyer.id}
                      onClick={() => setSelectedBuyerId(buyer.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        selectedBuyerId === buyer.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ${
                        selectedBuyerId === buyer.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {buyer.initials}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-semibold ${
                          selectedBuyerId === buyer.id ? 'text-teal-900' : 'text-gray-900'
                        }`}>
                          {buyer.name}
                        </p>
                      </div>
                      {selectedBuyerId === buyer.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600" strokeWidth={2} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 pb-8">
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('entry')}
                  disabled={!selectedBuyerId}
                  className="flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow disabled:shadow-none"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 'entry' && (
            <>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                <button
                  onClick={() => setTab('bulk')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    tab === 'bulk' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Excel Upload
                </button>
                <button
                  onClick={() => setTab('manual')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    tab === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Manual entry
                </button>
              </div>

              {tab === 'manual' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <p className="text-gray-700 text-sm font-semibold">Enter facility details</p>
                    <p className="text-gray-400 text-xs mt-0.5">Any facility ID and email will be accepted.</p>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-3 pb-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facility ID</p>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                      <div className="w-8" />
                    </div>
                    {rows.map((row, idx) => (
                      <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start">
                        <input
                          type="text"
                          value={row.facilityId}
                          onChange={e => updateRow(row.id, 'facilityId', e.target.value)}
                          placeholder={`e.g. FAC-${String(idx + 1).padStart(3, '0')}`}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                        />
                        <input
                          type="text"
                          value={row.email}
                          onChange={e => updateRow(row.id, 'email', e.target.value)}
                          placeholder="contact@facility.com"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition"
                        />
                        <button
                          onClick={() => removeRow(row.id)}
                          disabled={rows.length === 1}
                          className="mt-0.5 w-8 h-10 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition disabled:opacity-0 disabled:pointer-events-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addRow}
                      className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 px-1 py-1 rounded-lg hover:bg-primary-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add another row
                    </button>
                  </div>
                </div>
              )}

              {tab === 'bulk' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Step 1 — Download the template</p>
                      <p className="text-gray-400 text-xs mt-1">
                        The template includes 20 example entries you can use for demo purposes.
                      </p>
                    </div>
                    <button
                      onClick={downloadTemplate}
                      className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                      Download template (.xlsx)
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Step 2 — Upload your filled spreadsheet</p>
                      <p className="text-gray-400 text-xs mt-1">Supports .xlsx and .xls files.</p>
                    </div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-primary-100 flex items-center justify-center transition">
                        <FileSpreadsheet className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition" strokeWidth={1.75} />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 text-sm font-medium">
                          {bulkFileName ? bulkFileName : 'Click to choose a file'}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">.xlsx or .xls, max 5 MB</p>
                      </div>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition pointer-events-none"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Browse file
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    {bulkParseError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" strokeWidth={1.75} />
                        <p className="text-red-600 text-xs">{bulkParseError}</p>
                      </div>
                    )}
                  </div>

                  {bulkRows.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <p className="text-gray-700 text-sm font-semibold">Preview</p>
                        <span className="text-xs font-medium text-gray-400">
                          {bulkRows.length} row{bulkRows.length !== 1 ? 's' : ''} detected
                        </span>
                      </div>
                      <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
                        <div className="grid grid-cols-[1fr_1fr_auto] gap-3 pb-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Facility ID</p>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                          <div className="w-6" />
                        </div>
                        {bulkRows.map(row => (
                          <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center">
                            <div className="px-3 py-2 rounded-xl text-sm border border-gray-100 bg-gray-50 text-gray-800 truncate">
                              {row.facilityId || <span className="text-gray-300 italic">empty</span>}
                            </div>
                            <div className="px-3 py-2 rounded-xl text-sm border border-gray-100 bg-gray-50 text-gray-800 truncate">
                              {row.email || <span className="text-gray-300 italic">empty</span>}
                            </div>
                            <button
                              onClick={() => removeBulkRow(row.id)}
                              className="w-6 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 pb-8">
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={startChecking}
                  disabled={
                    tab === 'manual'
                      ? !rows.some(r => r.facilityId.trim() && r.email.trim())
                      : bulkRows.length === 0
                  }
                  className={`flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow disabled:shadow-none ${isIntermediary ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800' : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700'}`}
                >
                  <Database className="w-4 h-4" strokeWidth={1.75} />
                  Check Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 'checking' && (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-gray-700 text-sm font-semibold">Facilities</p>
                    {!allDoneChecking && (
                      <div className="flex items-center gap-1.5 text-xs text-primary-600 font-medium">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
                        Checking…
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {allDoneChecking && (
                      <>
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                          {matchedCount} matched
                        </span>
                        {unmatchedCount > 0 && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                            {unmatchedCount} not found
                          </span>
                        )}
                      </>
                    )}
                    <span className="text-xs font-medium text-gray-400">{checkedRows.length} total</span>
                  </div>
                </div>
                <div
                  ref={checkingListRef}
                  className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto"
                >
                  {checkedRows.map(row => (
                    <CheckedRowItem
                      key={row.id}
                      row={row}
                      rowRef={el => {
                        if (el) rowRefs.current.set(row.id, el);
                        else rowRefs.current.delete(row.id);
                      }}
                      onEdit={() => startEditRow(row.id)}
                      onSave={() => saveEditRow(row.id)}
                      onRemove={() => removeCheckedRow(row.id)}
                      onUpdateField={(field, val) => updateEditRow(row.id, field, val)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 pb-8">
                <button
                  onClick={() => setStep('entry')}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('preferences')}
                  disabled={!allDoneChecking || matchedCount === 0}
                  className={`flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow disabled:shadow-none ${isIntermediary ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800' : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700'}`}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 'preferences' && (
            <>
              <ReportPreferencesStep
                preferences={preferences}
                onChange={setPreferences}
                matchedCount={matchedCount}
                isIntermediary={isIntermediary}
                buyerName={selectedBuyer?.name || 'the selected buyer'}
              />

              <PreferencesSummary
                preferences={preferences}
                matchedCount={matchedCount}
                isIntermediary={isIntermediary}
              />

              <div className="flex items-center justify-between pt-2 pb-8">
                <button
                  onClick={() => setStep('checking')}
                  className="text-sm text-gray-400 hover:text-gray-600 font-medium transition"
                >
                  Back
                </button>
                <button
                  onClick={handleRequestReport}
                  disabled={submitted || preferences.selectedPayrollYears.length === 0}
                  className={`flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-sm hover:shadow disabled:shadow-none ${
                    isIntermediary
                      ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
                      : 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700'
                  }`}
                >
                  {submitted ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={1.75} />
                      {isIntermediary
                        ? 'Submit Producer Match & Preferences'
                        : 'Request Living Wage Gap Calculation Report'
                      }
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StepIndicator({ step, isIntermediary }: { step: FlowStep; isIntermediary: boolean }) {
  const buyerSteps: { key: FlowStep; label: string }[] = [
    { key: 'entry', label: 'Invite producers' },
    { key: 'checking', label: 'Check Details' },
    { key: 'preferences', label: 'Report preferences' },
  ];
  const intermediarySteps: { key: FlowStep; label: string }[] = [
    { key: 'buyer-select', label: 'Select buyer' },
    { key: 'entry', label: 'Invite producers' },
    { key: 'checking', label: 'Check Details' },
    { key: 'preferences', label: 'Data preferences' },
  ];
  const steps = isIntermediary ? intermediarySteps : buyerSteps;
  const order: FlowStep[] = isIntermediary ? ['buyer-select', 'entry', 'checking', 'preferences', 'done'] : ['entry', 'checking', 'preferences', 'done'];
  const current = order.indexOf(step);
  const activeBg = isIntermediary ? 'bg-teal-600 text-white' : 'bg-primary-500 text-white';

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const sOrder = order.indexOf(s.key);
        const isActive = sOrder === current;
        const isDone = sOrder < current;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              isActive
                ? activeBg
                : isDone
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {isDone ? <CheckCircle2 className="w-3 h-3" strokeWidth={2} /> : <span>{i + 1}</span>}
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckedRowItem({
  row,
  rowRef,
  onEdit,
  onSave,
  onRemove,
  onUpdateField,
}: {
  row: CheckedRow;
  rowRef: (el: HTMLDivElement | null) => void;
  onEdit: () => void;
  onSave: () => void;
  onRemove: () => void;
  onUpdateField: (field: 'editingFacilityId' | 'editingEmail', val: string) => void;
}) {
  return (
    <div
      ref={rowRef}
      className={`px-6 py-4 flex items-center gap-4 transition-colors duration-300 ${
        row.status === 'checking' ? 'bg-primary-50' : row.status === 'unmatched' ? 'bg-amber-50' : ''
      }`}
    >
      <div className="w-7 h-7 flex items-center justify-center shrink-0">
        {row.status === 'pending' && (
          <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
        )}
        {row.status === 'checking' && (
          <Loader2 className="w-5 h-5 text-primary-500 animate-spin" strokeWidth={2} />
        )}
        {row.status === 'matched' && (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2} />
        )}
        {row.status === 'unmatched' && (
          <AlertTriangle className="w-5 h-5 text-amber-500" strokeWidth={2} />
        )}
      </div>

      {row.isEditing ? (
        <div className="flex-1 grid grid-cols-2 gap-3">
          <input
            type="text"
            value={row.editingFacilityId ?? row.facilityId}
            onChange={e => onUpdateField('editingFacilityId', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-primary-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
          <input
            type="text"
            value={row.editingEmail ?? row.email}
            onChange={e => onUpdateField('editingEmail', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-primary-300 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{row.facilityId}</p>
          <p className="text-xs text-gray-400 truncate mt-0.5">{row.email}</p>
          {row.status === 'unmatched' && (
            <p className="text-xs text-amber-600 mt-1 font-medium">No match found in Salary Matrix Database — edit the details or remove this entry.</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0">
        {row.isEditing ? (
          <button
            onClick={onSave}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
          </button>
        ) : (
          (row.status === 'matched' || row.status === 'unmatched') && (
            <button
              onClick={onEdit}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )
        )}
        {(row.status === 'matched' || row.status === 'unmatched') && (
          <button
            onClick={onRemove}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
