import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

export const requireRegistrationIdGuard: CanActivateFn = (route): boolean | UrlTree => {
  const id = route.paramMap.get('id');
  if (id) return true;

  return inject(Router).parseUrl('/registries/discover');
};
