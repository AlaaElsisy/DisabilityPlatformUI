import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const cantReturnToLoginGuard: CanActivateFn = (route, state) => {
    const token=localStorage.getItem('token')
  const authToken=localStorage.getItem('authToken')
  const role=localStorage.getItem('role')?.toLowerCase()
  const _Router=inject(Router)
 if(token&&authToken!==null){
 if(role=='helper'){
  _Router.navigate(['/provider/home'])
  return false;
  
 }
 else if(role=='patient'){
  _Router.navigate(['/patienthome'])
  return false;
 }
                
  return false;
 }
else{
  return true
}

};
