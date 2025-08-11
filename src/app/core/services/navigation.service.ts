import { Injectable } from '@angular/core';

import { urlParam } from '../helpers/url-param.helper';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navigateToSignIn(): void {
    const loginUrl = `${environment.casUrl}/login?${urlParam({ service: `${environment.webUrl}/login` })}`;
    window.location.href = loginUrl;
  }

  navigateToOrcidSingIn(): void {
    const loginUrl = `${environment.casUrl}/login?${urlParam({
      redirectOrcid: 'true',
      service: `${environment.webUrl}/login/?next=${encodeURIComponent(environment.webUrl)}`,
    })}`;
    window.location.href = loginUrl;
  }

  navigateToInstitutionSignIn(): void {
    const loginUrl = `${environment.casUrl}/login?${urlParam({
      campaign: 'institution',
      service: `${environment.webUrl}/login/?next=${encodeURIComponent(environment.webUrl)}`,
    })}`;
    window.location.href = loginUrl;
  }
}
