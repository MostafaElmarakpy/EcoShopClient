
import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../shared/services/auth.service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
)
: boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
    if (authService.hasToken()) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }   



};