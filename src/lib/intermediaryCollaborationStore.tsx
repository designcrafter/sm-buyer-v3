import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface BuyerRelationship {
  id: string;
  buyerName: string;
  buyerInitials: string;
  contactName: string;
  contactEmail: string;
  suppliersManaged: number;
  since: string;
}

export interface BuyerInvite {
  id: string;
  buyerName: string;
  buyerInitials: string;
  contactName: string;
  contactEmail: string;
  receivedAt: string;
}

const DEMO_INVITES: BuyerInvite[] = [
  {
    id: 'inv-1',
    buyerName: 'FashionWorks Group',
    buyerInitials: 'FW',
    contactName: 'Anna Lindqvist',
    contactEmail: 'anna.lindqvist@fashionworks.com',
    receivedAt: '2 hours ago',
  },
  {
    id: 'inv-2',
    buyerName: 'MarketPlace Group',
    buyerInitials: 'MG',
    contactName: 'Pierre Moreau',
    contactEmail: 'p.moreau@marketplace.com',
    receivedAt: '1 day ago',
  },
];

const DEMO_RELATIONSHIPS: BuyerRelationship[] = [
  {
    id: 'rel-1',
    buyerName: 'BuyerCo International',
    buyerInitials: 'BC',
    contactName: 'Thomas Bauer',
    contactEmail: 't.bauer@buyerco.com',
    suppliersManaged: 12,
    since: 'Jan 2025',
  },
  {
    id: 'rel-2',
    buyerName: 'RetailHub Partners',
    buyerInitials: 'RH',
    contactName: 'Sophie Meier',
    contactEmail: 's.meier@retailhub.com',
    suppliersManaged: 8,
    since: 'Mar 2025',
  },
];

interface IntermediaryCollaborationContext {
  invites: BuyerInvite[];
  relationships: BuyerRelationship[];
  inviteCount: number;
  acceptInvite: (id: string) => void;
  declineInvite: (id: string) => void;
  endRelationship: (id: string) => void;
}

const Ctx = createContext<IntermediaryCollaborationContext | null>(null);

export function IntermediaryCollaborationProvider({ children }: { children: ReactNode }) {
  const [invites, setInvites] = useState<BuyerInvite[]>(DEMO_INVITES);
  const [relationships, setRelationships] = useState<BuyerRelationship[]>(DEMO_RELATIONSHIPS);

  const inviteCount = invites.length;

  const acceptInvite = useCallback((id: string) => {
    setInvites(prev => {
      const invite = prev.find(i => i.id === id);
      if (invite) {
        setRelationships(rels => [
          {
            id: `rel-${Date.now()}`,
            buyerName: invite.buyerName,
            buyerInitials: invite.buyerInitials,
            contactName: invite.contactName,
            contactEmail: invite.contactEmail,
            suppliersManaged: 0,
            since: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          },
          ...rels,
        ]);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const declineInvite = useCallback((id: string) => {
    setInvites(prev => prev.filter(i => i.id !== id));
  }, []);

  const endRelationship = useCallback((id: string) => {
    setRelationships(prev => prev.filter(r => r.id !== id));
  }, []);

  return (
    <Ctx.Provider value={{ invites, relationships, inviteCount, acceptInvite, declineInvite, endRelationship }}>
      {children}
    </Ctx.Provider>
  );
}

export function useIntermediaryCollaboration() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useIntermediaryCollaboration must be used within IntermediaryCollaborationProvider');
  return ctx;
}
