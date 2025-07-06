export interface DisabledRequest {
  id?: number;
  description: string;
  requestDate: string;
  status?: string;
  start?: string;
  end?: string;
  price?: number;
  disabledId: number;
  helperServiceId: number;
  helperName?: string;
  helperImage?: string;
 
}
