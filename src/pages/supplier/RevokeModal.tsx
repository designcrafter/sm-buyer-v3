import { useState } from 'react';
import { X, ShieldOff } from 'lucide-react';

interface Props {
  recipientName: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export default function RevokeModal({ recipientName, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState('');

  function handleConfirm() {
    onConfirm(reason.trim() || undefined);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={onCancel} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <ShieldOff className="w-4 h-4 text-red-500" strokeWidth={1.75} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Revoke Access</h3>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            You are revoking access for <span className="font-semibold text-gray-900">{recipientName}</span>. They will immediately lose access to your salary matrix data.
          </p>
          <label className="block mb-1.5">
            <span className="text-xs font-semibold text-gray-700">Reason for revoking (optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g., Contract ended, data sharing period expired, need to update information"
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition resize-none"
          />
          <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
            Providing a reason helps maintain transparency and professional relationships.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition shadow-sm"
          >
            Revoke Access
          </button>
        </div>
      </div>
    </>
  );
}
