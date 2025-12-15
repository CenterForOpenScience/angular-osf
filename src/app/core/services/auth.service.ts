import { createDispatchMap } from '@ngxs/store';

import { CookieService } from 'ngx-cookie-service';

import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { SignUpModel } from '@core/models/sign-up.model';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ClearCurrentUser } from '@osf/core/store/user';
import { urlParam } from '@osf/shared/helpers/url-param.helper';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { LoaderService } from '@osf/shared/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly cookieService = inject(CookieService);
  private readonly loaderService = inject(LoaderService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly actions = createDispatchMap({ clearCurrentUser: ClearCurrentUser });

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2/users/`;
  }

  get webUrl() {
    return this.environment.webUrl;
  }

  get casUrl() {
    return this.environment.casUrl;
  }

  navigateToSignIn(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loaderService.show();
    const loginUrl = `${this.casUrl}/login?${urlParam({ service: `${this.webUrl}/login`, next: window.location.href })}`;
    window.location.href = loginUrl;
  }

  navigateToOrcidSignIn(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const loginUrl = `${this.casUrl}/login?${urlParam({
      redirectOrcid: 'true',
      service: `${this.webUrl}/login`,
      next: window.location.href,
    })}`;

    window.location.href = loginUrl;
  }

  navigateToInstitutionSignIn(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const loginUrl = `${this.casUrl}/login?${urlParam({
      campaign: 'institution',
      service: `${this.webUrl}/login`,
      next: window.location.href,
    })}`;

    window.location.href = loginUrl;
  }

  logout(): void {
    this.loaderService.show();
    this.actions.clearCurrentUser();

    if (isPlatformBrowser(this.platformId)) {
      this.cookieService.deleteAll();
      window.location.href = `${this.webUrl}/logout/?next=${encodeURIComponent('/')}`;
    }
  }

  register(payload: SignUpModel) {
    const baseUrl = `${this.webUrl}/api/v1/register/`;
    const body = { ...payload, 'g-recaptcha-response': payload.recaptcha, campaign: null };

    return this.jsonApiService.post(baseUrl, body);
  }

  forgotPassword(email: string) {
    const baseUrl = `${this.apiUrl}/reset_password/`;
    const params: Record<string, string> = { email };

    return this.jsonApiService.get(baseUrl, params);
  }

  resetPassword(userId: string, token: string, newPassword: string) {
    const baseUrl = `${this.apiUrl}/reset_password/`;
    const body = {
      data: {
        attributes: {
          uid: userId,
          token,
          password: newPassword,
        },
      },
    };

    return this.jsonApiService.post(baseUrl, body);
  }
}
