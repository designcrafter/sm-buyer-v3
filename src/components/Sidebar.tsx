import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChartBig,
  Factory,
  Building2,
  BarChart3,
  Megaphone,
  Map,
  GraduationCap,
  Headphones,
  Handshake,
  Link,
  Settings,
  LayoutDashboard,
  ChevronsUpDown,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useDemoStore, INTERMEDIARY_SUPPLIER_ACCOUNT } from '../lib/demoStore';
import { useSupplierCollaboration } from '../lib/supplierCollaborationStore';
import { useIntermediaryCollaboration } from '../lib/intermediaryCollaborationStore';
import { DEMO_BAR_HEIGHT } from './DemoBar';

const NAV_BUYER = [
  { to: '/dashboard', icon: BarChart3, label: "Buyer's Dashboard" },
  { to: '/supply-chain', icon: Link, label: 'Supply Chain' },
  { to: '/producers', icon: Building2, label: 'Producers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const NAV_INTERMEDIARY = [
  { to: '/intermediary/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/intermediary/producers', icon: Factory, label: 'Producers' },
  { to: '/intermediary/supply-chain', icon: Link, label: 'Supply Chain', hasBadge: 'intermediary' as const },
  { to: '/intermediary/settings', icon: Settings, label: 'Settings' },
];

const NAV_SUPPLIER = [
  { to: '/supplier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/supplier/facilities', icon: Factory, label: 'Facilities' },
  { to: '/supplier/wage-calculations', icon: BarChart3, label: 'Wage Calculations' },
  { to: '/supplier/collaboration', icon: Handshake, label: 'Collaboration', hasBadge: true },
];

const NAV_SUPPORT = [
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/guided-tour', icon: Map, label: 'Guided Tour' },
  { to: '/e-learning', icon: GraduationCap, label: 'E-Learning' },
  { to: '/support', icon: Headphones, label: 'Contact Support' },
];

export default function Sidebar() {
  const { activeRole, activeBuyer } = useDemoStore();
  const { pendingCount } = useSupplierCollaboration();
  const { inviteCount } = useIntermediaryCollaboration();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const isIntermediary = activeRole === 'intermediary';
  const isSupplier = activeRole === 'supplier';
  const navItems = isSupplier ? NAV_SUPPLIER : isIntermediary ? NAV_INTERMEDIARY : NAV_BUYER;

  const bgClass = isSupplier ? 'bg-emerald-800' : isIntermediary ? 'bg-teal-700' : 'bg-primary-500';
  const borderClass = isSupplier ? 'border-emerald-700' : isIntermediary ? 'border-teal-600' : 'border-primary-400';
  const activeBgClass = 'bg-white bg-opacity-20';
  const hoverBgClass = 'hover:bg-white hover:bg-opacity-10';
  const userBgClass = isSupplier ? 'bg-emerald-950' : isIntermediary ? 'bg-teal-900' : 'bg-primary-700';

  return (
    <aside className={`w-64 shrink-0 ${bgClass} flex flex-col h-screen sticky font-sans`} style={{ top: DEMO_BAR_HEIGHT }}>
      <div className={`px-5 py-5 border-b ${borderClass} border-opacity-40`}>
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 rounded-xl p-2">
            <BarChartBig className="w-5 h-5 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-white text-xs font-semibold tracking-widest uppercase opacity-70">IDH</p>
            <p className="text-white font-bold text-sm leading-tight">Salary Matrix</p>
          </div>
        </div>
      </div>

      {isIntermediary && (
        <div className={`px-3 py-3 border-b ${borderClass} border-opacity-40 relative`}>
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg ${hoverBgClass} transition group`}
          >
            <div className="w-7 h-7 rounded-lg bg-white bg-opacity-15 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-white">{INTERMEDIARY_SUPPLIER_ACCOUNT.initials}</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-[10px] font-medium uppercase tracking-wider opacity-60">Supplier account</p>
              <p className="text-white text-xs font-semibold truncate">{INTERMEDIARY_SUPPLIER_ACCOUNT.name}</p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white opacity-50 group-hover:opacity-100 transition shrink-0 ${accountMenuOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
            />
          </button>

          {accountMenuOpen && (
            <div className="absolute left-3 right-3 mt-1 bg-teal-800 rounded-lg shadow-xl border border-teal-600 border-opacity-40 overflow-hidden z-50">
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white hover:bg-opacity-10 transition">
                <div className="w-7 h-7 rounded-lg bg-white bg-opacity-15 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-white">{INTERMEDIARY_SUPPLIER_ACCOUNT.initials}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-[10px] font-medium uppercase tracking-wider opacity-60">Supplier account</p>
                  <p className="text-white text-xs font-semibold truncate">{INTERMEDIARY_SUPPLIER_ACCOUNT.name}</p>
                </div>
                <Check className="w-4 h-4 text-white shrink-0" strokeWidth={2} />
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white hover:bg-opacity-10 transition border-t border-teal-600 border-opacity-40">
                <div className="w-7 h-7 rounded-lg bg-white bg-opacity-15 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-white">LI</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-white text-[10px] font-medium uppercase tracking-wider opacity-60">Buyer account</p>
                  <p className="text-white text-xs font-semibold truncate">Lidl International</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left border-t border-teal-600 border-opacity-40 opacity-50 cursor-not-allowed">
                <div className="w-7 h-7 rounded-lg bg-white bg-opacity-15 flex items-center justify-center shrink-0">
                  <Factory className="w-3.5 h-3.5 text-white" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[10px] font-medium uppercase tracking-wider opacity-60">Producer account</p>
                  <p className="text-white text-xs font-semibold truncate">Not available</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label, hasBadge }) => {
          const badgeCount = hasBadge === true ? pendingCount : hasBadge === 'intermediary' ? inviteCount : 0;
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-100 ${
                  isActive
                    ? `${activeBgClass} text-white font-semibold`
                    : `text-white opacity-75 hover:opacity-100 ${hoverBgClass}`
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              {label}
              {hasBadge && badgeCount > 0 && (
                <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5">
                  {badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={`px-3 py-3 border-t ${borderClass} border-opacity-40 space-y-0.5`}>
        {NAV_SUPPORT.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100 ${
                isActive
                  ? `${activeBgClass} text-white`
                  : `text-white text-opacity-60 ${hoverBgClass} hover:text-white`
              }`
            }
          >
            <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </div>

      <div className={`px-3 py-4 border-t ${borderClass} border-opacity-40`}>
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${hoverBgClass} transition group`}>
          <div className={`w-8 h-8 rounded-full ${userBgClass} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {isSupplier ? 'AO' : isIntermediary ? 'DO' : 'MG'}
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-white text-xs font-semibold truncate">
                {isSupplier ? 'Amara Okafor' : isIntermediary ? 'David Osei' : 'Morgan Green'}
              </p>
              {isIntermediary && (
                <span className="text-[9px] font-semibold bg-white bg-opacity-20 text-white px-1.5 py-0.5 rounded-full shrink-0">
                  Int.
                </span>
              )}
              {isSupplier && (
                <span className="text-[9px] font-semibold bg-white bg-opacity-20 text-white px-1.5 py-0.5 rounded-full shrink-0">
                  Sup.
                </span>
              )}
            </div>
            <p className="text-white text-xs truncate opacity-60">
              {isSupplier ? 'amara@abcinc.com' : isIntermediary ? 'david@intermediaryco.com' : 'morgan@abcinc.com'}
            </p>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-white opacity-50 group-hover:opacity-100 transition shrink-0" strokeWidth={1.75} />
        </button>
      </div>
    </aside>
  );
}
