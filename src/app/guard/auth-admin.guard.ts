import { inject } from "@angular/core";
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
        return false;
      }

      if (authService.currentUserSig()?.role.admin) {
        return true;
      }

      router.navigate(['/user/purchase-product']);
      return false;
    })
  );
};
