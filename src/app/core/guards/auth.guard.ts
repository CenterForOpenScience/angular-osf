import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { NavigationService } from '@osf/core/services';
import { AuthService } from '@osf/features/auth/services';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const navigationService = inject(NavigationService);

  if (!authService.isAuthenticated()) {
    navigationService.navigateToSignIn();
    return false;
  }

  return true;
};
