export interface Payment {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  amount: number;
  token: string;            
  paymentMethod: string;   
  helperRequestId?: number | null;  
  disabledRequestId?: number | null;
  offerId : number | null ;

} 


