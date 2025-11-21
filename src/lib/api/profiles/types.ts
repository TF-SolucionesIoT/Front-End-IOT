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
}
