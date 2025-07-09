export interface DisabledRequestwithdetails {
    id?: number;
  description: string;
  requestDate: string;
  start?: string;
  end?: string;
  price?: number;
  status: string;
  helperServiceId?: number;
  helperName?: string;
  helperImage?: string;
  serviceDescription?: string;
  pricePerHour?: number;
  categoryName?: string;
  availableDateFrom?: string;
  availableDateTo?: string;
  disabledId?: number;
  patientName?:string;
}
