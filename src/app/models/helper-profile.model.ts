export interface HelperProfile {
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
}
