import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navigateToSignIn(): void {
    const loginUrl = `${environment.casUrl}/login?service=${environment.webUrl}/login`;
    window.location.href = loginUrl;
  }
}
