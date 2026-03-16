import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type RequesterType = 'buyer' | 'intermediary';
export type CollaborationStatus = 'pending' | 'approved' | 'declined' | 'revoked';

export interface DataAccessPreferences {
  selectedPayrollYears: number[];
  duration: 'single' | 'ongoing';
  requestAuditData: boolean;
  requestVoluntaryContribution: boolean;
}

export interface CollaborationRequest {
  id: string;
  requesterName: string;
  requesterOrg: string;
  requesterInitials: string;
  requesterType: RequesterType;
  actingOnBehalfOf?: string;
  actingOnBehalfOfInitials?: string;
  requested: DataAccessPreferences;
  approved?: DataAccessPreferences;
  status: CollaborationStatus;
  declineReason?: string;
  requestedAt: string;
  respondedAt?: string;
  revokedAt?: string;
}

const CURRENT_YEAR = new Date().getFullYear();

const DEMO_INCOMING_REQUESTS: CollaborationRequest[] = [
  {
    id: 'collab-1',
    requesterName: 'Morgan Green',
    requesterOrg: 'Lidl International',
    requesterInitials: 'MG',
    requesterType: 'buyer',
    requested: {
      selectedPayrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2],
      duration: 'ongoing',
      requestAuditData: true,
      requestVoluntaryContribution: false,
    },
    status: 'pending',
    requestedAt: '2 days ago',
  },
  {
    id: 'collab-2',
    requesterName: 'David Osei',
    requesterOrg: 'IntermediaCo Textiles',
    requesterInitials: 'DO',
    requesterType: 'intermediary',
    actingOnBehalfOf: 'Zalando SE',
    actingOnBehalfOfInitials: 'ZA',
    requested: {
      selectedPayrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1],
      duration: 'single',
      requestAuditData: false,
      requestVoluntaryContribution: true,
    },
    status: 'pending',
    requestedAt: '5 hours ago',
  },
  {
    id: 'collab-3',
    requesterName: 'Sophie Laurent',
    requesterOrg: 'Carrefour Group',
    requesterInitials: 'SL',
    requesterType: 'buyer',
    requested: {
      selectedPayrollYears: [CURRENT_YEAR - 1, CURRENT_YEAR - 2, CURRENT_YEAR - 3],
      duration: 'ongoing',
      requestAuditData: true,
      requestVoluntaryContribution: true,
    },
    status: 'pending',
    requestedAt: '1 week ago',
  },
];

const DEMO_ACTIVE_ACCESS: CollaborationRequest[] = [
  {
    id: 'collab-4',
    requesterName: 'Thomas Bauer',
    requesterOrg: 'ALDI Sud',
    requesterInitials: 'TB',
    requesterType: 'buyer',
    requested: {
      selectedPayrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1],
      duration: 'ongoing',
      requestAuditData: true,
      requestVoluntaryContribution: false,
    },
    approved: {
      selectedPayrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1],
      duration: 'ongoing',
      requestAuditData: true,
      requestVoluntaryContribution: false,
    },
    status: 'approved',
    requestedAt: '3 weeks ago',
    respondedAt: '2 weeks ago',
  },
  {
    id: 'collab-5',
    requesterName: 'Elena Rossi',
    requesterOrg: 'FairTrade Connect',
    requesterInitials: 'ER',
    requesterType: 'intermediary',
    actingOnBehalfOf: 'H&M Group',
    actingOnBehalfOfInitials: 'HM',
    requested: {
      selectedPayrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2],
      duration: 'ongoing',
      requestAuditData: false,
      requestVoluntaryContribution: true,
    },
    approved: {
      selectedPayrollYears: [CURRENT_YEAR, CURRENT_YEAR - 1],
      duration: 'ongoing',
      requestAuditData: false,
      requestVoluntaryContribution: true,
    },
    status: 'approved',
    requestedAt: '1 month ago',
    respondedAt: '3 weeks ago',
  },
];

interface SupplierCollaborationContext {
  incomingRequests: CollaborationRequest[];
  activeAccess: CollaborationRequest[];
  pendingCount: number;
  approveRequest: (id: string, approved: DataAccessPreferences) => void;
  declineRequest: (id: string, reason?: string) => void;
  revokeAccess: (id: string) => void;
  updateAccess: (id: string, updated: DataAccessPreferences) => void;
}

const Ctx = createContext<SupplierCollaborationContext | null>(null);

export function SupplierCollaborationProvider({ children }: { children: ReactNode }) {
  const [incomingRequests, setIncoming] = useState<CollaborationRequest[]>(DEMO_INCOMING_REQUESTS);
  const [activeAccess, setActive] = useState<CollaborationRequest[]>(DEMO_ACTIVE_ACCESS);

  const pendingCount = incomingRequests.filter(r => r.status === 'pending').length;

  const approveRequest = useCallback((id: string, approved: DataAccessPreferences) => {
    setIncoming(prev => prev.filter(r => r.id !== id));
    setActive(prev => {
      const request = incomingRequests.find(r => r.id === id);
      if (!request) return prev;
      const record: CollaborationRequest = {
        ...request,
        status: 'approved',
        approved,
        respondedAt: 'Just now',
      };
      return [record, ...prev];
    });
  }, [incomingRequests]);

  const declineRequest = useCallback((id: string, reason?: string) => {
    setIncoming(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'declined' as const, declineReason: reason, respondedAt: 'Just now' } : r
      ).filter(r => r.id !== id)
    );
  }, []);

  const revokeAccess = useCallback((id: string) => {
    setActive(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateAccess = useCallback((id: string, updated: DataAccessPreferences) => {
    setActive(prev =>
      prev.map(r => r.id === id ? { ...r, approved: updated } : r)
    );
  }, []);

  return (
    <Ctx.Provider value={{
      incomingRequests, activeAccess, pendingCount,
      approveRequest, declineRequest, revokeAccess, updateAccess,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSupplierCollaboration() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSupplierCollaboration must be used within SupplierCollaborationProvider');
  return ctx;
}
