export interface EmergencyContact {
  id?: number;
  name: string;
  phoneNumber: string;
  connection?: string;
  patientId?: number;
}

export interface CreateEmergencyContactRequest {
  name: string;
  phoneNumber: string;
  connection?: string;
  patientId: number;
}

export interface UpdateEmergencyContactRequest {
  name: string;
  phoneNumber: string;
  connection?: string;
}
