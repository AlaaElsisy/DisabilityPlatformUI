export interface PatientProfile {
 user:{
   id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | Date;
  gender: number;
  address:string;
  zone: string | null;
  profileImage: string | null;
  createdAt: string;
 }
  medicalConditionDescription: string;
  disabilityType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}
