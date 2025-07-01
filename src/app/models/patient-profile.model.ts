export interface PatientProfile {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | Date;
  gender: 'male' | 'female';
  address:string;
  zone: string | null;
  profileImage: string | null;
  createdAt: string;
  medicalConditionDescription: string;
  disabilityType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}
