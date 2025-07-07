export interface HelperProfile {
 user:{
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
 }
}
