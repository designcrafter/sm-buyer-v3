import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Building2,
  Mail,
  User,
  Calendar,
  Users,
  Lock,
  Settings as SettingsIcon,
  CheckCircle2,
} from 'lucide-react';
import { useDemoStore } from '../../lib/demoStore';
import { useIntermediaryCollaboration } from '../../lib/intermediaryCollaborationStore';

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
      </div>
      <p className="text-gray-700 text-sm font-semibold">{label}</p>
      <p className="text-gray-400 text-xs mt-1.5 max-w-xs leading-relaxed">
        This section is coming soon. Stay tuned for updates.
      </p>
    </div>
  );
}

export default function IntermediarySettingsPage() {
  const { activeBuyer } = useDemoStore();
  const { relationships } = useIntermediaryCollaboration();

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-4xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-gray-900 text-xl font-bold">Settings</h1>
              <span className="text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 px-2 py-0.5 rounded-full">Intermediary</span>
            </div>
            <p className="text-gray-400 text-xs mt-0.5">
              Manage your intermediary account settings and preferences
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-gray-900 font-bold text-sm">Account Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Company Name</label>
                <input
                  type="text"
                  defaultValue="Global Sourcing Partners Ltd."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Contact Email</label>
                <input
                  type="email"
                  defaultValue="contact@globalsourcing.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Primary Contact</label>
                  <input
                    type="text"
                    defaultValue="Alex Johnson"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition shadow-sm">
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-gray-900 font-bold text-sm">Active Buyer Relationships</h2>
              <p className="text-xs text-gray-400 mt-1">Buyers you're currently working with as an intermediary</p>
            </div>
            {relationships.length === 0 ? (
              <div className="px-6 py-12 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 text-sm">No active relationships</p>
                <p className="text-gray-400 text-xs mt-1">Accept buyer invitations to start working with them</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {relationships.map(rel => (
                  <div key={rel.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary-700">{rel.buyerInitials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{rel.buyerName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" strokeWidth={1.75} />
                          {rel.contactEmail}
                        </span>
                        <span className="text-gray-200">|</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" strokeWidth={1.75} />
                          Since {rel.since}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                      <span className="text-xs font-semibold">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-gray-900 font-bold text-sm">Notifications</h2>
            </div>
            <ComingSoon label="Notification preferences coming soon" />
          </div>
        </div>
      </main>
    </div>
  );
}
