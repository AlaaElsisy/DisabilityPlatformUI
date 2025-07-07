export interface Payment {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  amount: number;
  token: string;            
  paymentMethod: string;   
  toHelperId: number;
  fromPatientId: number;
  helperRequestId?: number | null;
  disabledRequestId?: number | null;
}
