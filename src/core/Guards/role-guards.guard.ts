import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const roleGuardsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const token = localStorage.getItem('token');
  const authToken = localStorage.getItem('authToken');
  const role = (localStorage.getItem('role') || '').toLowerCase(); 
  const router = inject(Router);

  const expectedRole = (route.data['expectedRole'] || '').toLowerCase();

  if (token && authToken) {
    if (expectedRole && role !== expectedRole) {
     
      if (role === 'helper') {
        router.navigate(['/provider/home']);
      } else if (role === 'patient') {
        router.navigate(['/patienthome']);
      } else {
        router.navigate(['/home']);
      }

      return false;
    }

    return true;
  }

  router.navigate(['/login']);
  return false;
};
