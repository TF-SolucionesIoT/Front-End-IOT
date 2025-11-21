// ==================== DISTURBANCES (Alteraciones) ====================

export interface CreateDisturbanceRequest {
  name: string;
  description: string;
  severity_level: number; // 1 - 5
  onset_date: string; // Formato: YYYY-MM-DD
}

export interface Disturbance {
  id: number;
  name: string;
  description: string;
  severityLevel: number; // 1 - 5
  onsetDate: string; // Formato: YYYY-MM-DD
}

export interface DeleteDisturbanceRequest {
  disturbanceId: number;
}

// ==================== SYMPTOMS (Síntomas) ====================

export interface CreateSymptonRequest {
  name: string;
  description: string;
  severity_level: number; // 1 - 5
  onset_date: string; // ISO format: YYYY-MM-DDTHH:mm:ss
  category: string;
  resolution_date?: string; // ISO format: YYYY-MM-DDTHH:mm:ss (opcional)
}

export interface Symptom {
  id: number;
  name: string;
  description: string;
  severityLevel: number; // 1 - 5
  onsetDate: string; // ISO format
  category: string;
  resolutionDate?: string; // ISO format (opcional)
}

export interface DeleteSymptonRequest {
  symptonId: number;
}

// ==================== TREATMENTS (Tratamientos) ====================

export interface CreateTreatmentRequest {
  name: string;
  description: string;
  frequency: string;
  dosage: string;
  startDate: string; // ISO format: YYYY-MM-DDTHH:mm:ss
  endDate?: string; // ISO format: YYYY-MM-DDTHH:mm:ss (opcional)
  isActive: boolean;
}

export interface Treatment {
  id: number;
  name: string;
  description: string;
  frequency: string;
  dosage: string;
  startDate: string; // ISO format
  endDate?: string; // ISO format (opcional)
  isActive: boolean;
}
