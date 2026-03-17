import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, FileDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}

function FilterDropdown({ label, options, selected, onToggle }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const activeLabel = selected.length === 0
    ? label
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 text-xs font-medium border rounded-lg px-3 py-2 transition ${
          selected.length > 0
            ? 'bg-primary-50 border-primary-300 text-primary-700'
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        <span className="text-gray-400 font-normal">{label}:</span>
        <span className="font-semibold">{selected.length === 0 ? 'All' : activeLabel}</span>
        {selected.length > 0 ? (
          <button
            onClick={e => { e.stopPropagation(); selected.forEach(onToggle); }}
            className="text-primary-400 hover:text-primary-600 transition"
          >
            <X className="w-3 h-3" />
          </button>
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg min-w-[200px] max-h-[280px] overflow-y-auto py-1">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
            >
              <span>{opt}</span>
              {selected.includes(opt) && <Check className="w-3 h-3 text-primary-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  allCountries: string[];
  allRegions: string[];
  allYears: number[];
  allProducts: string[];
  selectedCountries: string[];
  selectedRegions: string[];
  selectedYears: number[];
  selectedProducts: string[];
  onToggleCountry: (c: string) => void;
  onToggleRegion: (r: string) => void;
  onToggleYear: (y: number) => void;
  onToggleProduct: (p: string) => void;
  onExportPdf: () => void;
  hasFilters: boolean;
  onClear: () => void;
}

export function FilterBar({
  allCountries,
  allRegions,
  allYears,
  allProducts,
  selectedCountries,
  selectedRegions,
  selectedYears,
  selectedProducts,
  onToggleCountry,
  onToggleRegion,
  onToggleYear,
  onToggleProduct,
  onExportPdf,
  hasFilters,
  onClear,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap print:hidden">
      <div className="flex items-center gap-2 flex-wrap">
        <FilterDropdown
          label="Country"
          options={allCountries}
          selected={selectedCountries}
          onToggle={onToggleCountry}
        />
        <FilterDropdown
          label="Region"
          options={allRegions}
          selected={selectedRegions}
          onToggle={onToggleRegion}
        />
        <FilterDropdown
          label="Year"
          options={allYears.map(String)}
          selected={selectedYears.map(String)}
          onToggle={v => onToggleYear(Number(v))}
        />
        <FilterDropdown
          label="Product"
          options={allProducts}
          selected={selectedProducts}
          onToggle={onToggleProduct}
        />
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium transition flex items-center gap-1 ml-1"
          >
            <X className="w-3 h-3" />
            Reset filter
          </button>
        )}
      </div>

      <button
        onClick={onExportPdf}
        className="flex items-center gap-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3.5 py-2 bg-white hover:bg-gray-50 transition"
      >
        <FileDown className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.75} />
        Export PDF
      </button>
    </div>
  );
}
