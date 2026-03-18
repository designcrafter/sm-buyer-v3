import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type DemoRole = 'buyer' | 'intermediary' | 'supplier';

export interface DemoBuyer {
  id: string;
  name: string;
  initials: string;
}

export const DEMO_BUYERS: DemoBuyer[] = [
  { id: 'buyer-1', name: 'Lidl International', initials: 'LI' },
  { id: 'buyer-2', name: 'Zalando SE', initials: 'ZA' },
];

export const INTERMEDIARY_SUPPLIER_ACCOUNT = {
  name: 'IntermediaCo Textiles',
  initials: 'IT',
};

export interface BuyerInvitation {
  id: string;
  buyer: DemoBuyer;
  invitedAt: string;
}

export const DEMO_PENDING_INVITATIONS: BuyerInvitation[] = [
  {
    id: 'inv-1',
    buyer: { id: 'buyer-3', name: 'H&M Group', initials: 'HM' },
    invitedAt: '2 hours ago',
  },
];

interface DemoStoreContext {
  activeRole: DemoRole;
  activeBuyerId: string;
  activeBuyer: DemoBuyer;
  allBuyers: DemoBuyer[];
  pendingInvitations: BuyerInvitation[];
  setActiveRole: (role: DemoRole) => void;
  setActiveBuyerId: (id: string) => void;
  dismissInvitation: (id: string) => void;
  acceptInvitation: (id: string) => void;
}

const Ctx = createContext<DemoStoreContext | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRoleState] = useState<DemoRole>('buyer');
  const [activeBuyerId, setActiveBuyerIdState] = useState<string>(DEMO_BUYERS[0].id);
  const [pendingInvitations, setPendingInvitations] = useState<BuyerInvitation[]>(DEMO_PENDING_INVITATIONS);

  const setActiveRole = useCallback((role: DemoRole) => {
    setActiveRoleState(role);
  }, []);

  const setActiveBuyerId = useCallback((id: string) => {
    setActiveBuyerIdState(id);
  }, []);

  const dismissInvitation = useCallback((id: string) => {
    setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const acceptInvitation = useCallback((id: string) => {
    setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
  }, []);

  const activeBuyer = DEMO_BUYERS.find(b => b.id === activeBuyerId) ?? DEMO_BUYERS[0];

  return (
    <Ctx.Provider value={{
      activeRole, activeBuyerId, activeBuyer, allBuyers: DEMO_BUYERS, pendingInvitations,
      setActiveRole, setActiveBuyerId, dismissInvitation, acceptInvitation,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDemoStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDemoStore must be used within DemoStoreProvider');
  return ctx;
}
