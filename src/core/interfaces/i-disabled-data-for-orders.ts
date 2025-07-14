export interface IDisabledDataForOrders  {
  id: number;
  userId: string;
  disabilityType: string;
  medicalConditionDescription: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  disabledRequests: any[]; 
  disabledOffers: any[];   
  user?: {
    fullName: string;
    address: string;
    zone: string | null;
    dateOfBirth?: string;
    gender?: string;
  
  };
}