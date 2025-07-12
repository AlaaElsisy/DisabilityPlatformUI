import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaymentDataService {
  private key = 'paymentData';

  setData(data: any) {
    sessionStorage.setItem(this.key, JSON.stringify(data));
  }

  getData(): any {
    const stored = sessionStorage.getItem(this.key);
    return stored ? JSON.parse(stored) : null;
  }

  clearData() {
    sessionStorage.removeItem(this.key);
  }
}
