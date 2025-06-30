export interface ServiceRequest {
  serviceNeeded: string;
  description: string;
  dateTime: Date | string;
  location: string;
  estimatedHours: number;
  expectedCost: number;

}
