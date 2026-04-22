export type SubmissionPath = 'licensed' | 'new_application';
export type SurveyorStatus = 'pending' | 'matched' | 'needs_revision' | 'not_required';
export type SuperAdminStatus = 'pending' | 'approved' | 'rejected';
export type OverallStatus =
  | 'in_progress'
  | 'awaiting_surveyor'
  | 'awaiting_superadmin'
  | 'approved'
  | 'needs_revision';

export interface WellSubmissionWorkflow {
  id: string;
  wellCode: string;
  wellName: string;
  location: string;
  wellType: string;
  submissionPath: SubmissionPath;
  lat?: number;
  lng?: number;
  wellDepth?: number;
  licenseNumber?: string;
  licenseIssuedBy?: string;
  licenseValidUntil?: string;
  uploadedDocumentCount: number;
  requiredDocumentCount: number;
  surveyorStatus: SurveyorStatus;
  superAdminStatus: SuperAdminStatus;
  surveyorNote?: string;
  adminNote?: string;
  superAdminNote?: string;
  updatedAt: string;
  createdAt: string;
}

const STORAGE_KEY = 'sigat_well_submissions';

const SEED_DATA: WellSubmissionWorkflow[] = [
  {
    id: 'ws-001',
    wellCode: 'SW-BDL-001',
    wellName: 'Sumur Bor Dalam Lampung 1',
    location: 'Bandar Lampung',
    wellType: 'sumur_bor',
    submissionPath: 'licensed',
    lat: -5.3971,
    lng: 105.2668,
    wellDepth: 80,
    licenseNumber: 'SIPA/2021/BDL/001',
    licenseIssuedBy: 'Dinas ESDM Lampung',
    licenseValidUntil: '2026-12-31',
    uploadedDocumentCount: 3,
    requiredDocumentCount: 3,
    surveyorStatus: 'not_required',
    superAdminStatus: 'approved',
    adminNote: 'SIPA telah dimiliki dan berlaku hingga 2026',
    updatedAt: '2025-01-15',
    createdAt: '2025-01-10',
  },
  {
    id: 'ws-002',
    wellCode: 'SW-LMP-002',
    wellName: 'Sumur Bor Lampung Tengah',
    location: 'Lampung Tengah',
    wellType: 'sumur_bor',
    submissionPath: 'new_application',
    lat: -5.1234,
    lng: 105.4567,
    wellDepth: 60,
    uploadedDocumentCount: 4,
    requiredDocumentCount: 7,
    surveyorStatus: 'pending',
    superAdminStatus: 'pending',
    updatedAt: '2025-03-20',
    createdAt: '2025-03-01',
  },
  {
    id: 'ws-003',
    wellCode: 'SW-MTR-003',
    wellName: 'Sumur Tanah Metro',
    location: 'Metro',
    wellType: 'sumur_dangkal',
    submissionPath: 'new_application',
    lat: -5.1128,
    lng: 105.3069,
    wellDepth: 25,
    uploadedDocumentCount: 7,
    requiredDocumentCount: 7,
    surveyorStatus: 'needs_revision',
    superAdminStatus: 'pending',
    surveyorNote:
      'Data koordinat tidak cocok dengan foto lapangan. Harap upload ulang foto dari titik GPS yang benar.',
    updatedAt: '2025-03-28',
    createdAt: '2025-02-15',
  },
  {
    id: 'ws-004',
    wellCode: 'SW-TBS-004',
    wellName: 'Sumur Bor Tulang Bawang',
    location: 'Tulang Bawang',
    wellType: 'sumur_bor',
    submissionPath: 'licensed',
    lat: -4.4892,
    lng: 105.5734,
    wellDepth: 95,
    licenseNumber: 'SIPAS/2022/TBS/003',
    licenseIssuedBy: 'Dinas ESDM Lampung',
    licenseValidUntil: '2027-06-30',
    uploadedDocumentCount: 2,
    requiredDocumentCount: 3,
    surveyorStatus: 'not_required',
    superAdminStatus: 'pending',
    updatedAt: '2025-04-01',
    createdAt: '2025-03-25',
  },
];

function initStore(): WellSubmissionWorkflow[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  try {
    const parsed = JSON.parse(raw) as WellSubmissionWorkflow[];
    return parsed.map((r) => ({
      submissionPath: 'new_application' as SubmissionPath,
      ...r,
    }));
  } catch {
    return SEED_DATA;
  }
}

export function loadWellSubmissionWorkflows(): WellSubmissionWorkflow[] {
  return initStore();
}

export function updateWellSubmissionWorkflow(
  id: string,
  updater: (row: WellSubmissionWorkflow) => WellSubmissionWorkflow,
): void {
  const rows = initStore();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return;
  rows[idx] = { ...updater(rows[idx]), updatedAt: new Date().toISOString().slice(0, 10) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function addWellSubmissionWorkflow(
  row: Omit<WellSubmissionWorkflow, 'id' | 'createdAt' | 'updatedAt'>,
): WellSubmissionWorkflow {
  const rows = initStore();
  const today = new Date().toISOString().slice(0, 10);
  const newRow: WellSubmissionWorkflow = {
    ...row,
    id: `ws-${Date.now()}`,
    createdAt: today,
    updatedAt: today,
  };
  rows.push(newRow);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  return newRow;
}

export function getOverallSubmissionStatus(row: WellSubmissionWorkflow): OverallStatus {
  if (row.superAdminStatus === 'approved') return 'approved';
  if (row.surveyorStatus === 'needs_revision' || row.superAdminStatus === 'rejected')
    return 'needs_revision';
  if (row.surveyorStatus === 'matched' || row.surveyorStatus === 'not_required')
    return 'awaiting_superadmin';
  if (row.uploadedDocumentCount >= row.requiredDocumentCount) return 'awaiting_surveyor';
  return 'in_progress';
}

export const OVERALL_STATUS_CLASS: Record<OverallStatus, string> = {
  in_progress: 'bg-slate-100 text-slate-600 border-slate-200',
  awaiting_surveyor: 'bg-blue-50 text-blue-700 border-blue-200',
  awaiting_superadmin: 'bg-violet-50 text-violet-700 border-violet-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  needs_revision: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const OVERALL_STATUS_LABEL: Record<OverallStatus, string> = {
  in_progress: 'Dalam Proses',
  awaiting_surveyor: 'Menunggu Surveyor',
  awaiting_superadmin: 'Menunggu Super Admin',
  approved: 'Disetujui',
  needs_revision: 'Perlu Revisi',
};
