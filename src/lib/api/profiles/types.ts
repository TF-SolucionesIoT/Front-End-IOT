export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  username: string;
  phoneNumber?: string;
  birthday?: string;
  typeOfUser?: string; // 'PATIENT' | 'CAREGIVER'
  patientId?: number;   // ID de la tabla patient (solo para usuarios tipo PATIENT)
  caregiverId?: number; // ID de la tabla caregiver (solo para usuarios tipo CAREGIVER)
}
