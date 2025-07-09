import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const token=localStorage.getItem('token')
  const authToken=localStorage.getItem('authToken')
  
  const _Router=inject(Router)
 if(token&&authToken!==null){
  return true;
 }
else{
  _Router.navigate(['/login'])
  return false
}

 
};
