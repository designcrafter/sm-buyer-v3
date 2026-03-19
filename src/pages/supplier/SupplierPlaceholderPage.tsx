import Sidebar from '../../components/Sidebar';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
}

export default function SupplierPlaceholderPage({ title }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">{title}</h1>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-16 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center mb-4">
              <Construction className="w-7 h-7 text-primary-300" strokeWidth={1.5} />
            </div>
            <p className="text-gray-700 text-sm font-semibold mb-1">{title}</p>
            <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
              This section is part of the full supplier portal and is not included in this prototype.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
