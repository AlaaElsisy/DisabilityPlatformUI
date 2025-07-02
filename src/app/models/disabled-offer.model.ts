export interface DisabledOffer {
  id?: number;
  description?: string;
  offerPostDate: string;
  startServiceTime?: string;
  endServiceTime?: string;
  status?: string;
  budget?: number;
  disabledId: number;
  serviceCategorId: number;
} 