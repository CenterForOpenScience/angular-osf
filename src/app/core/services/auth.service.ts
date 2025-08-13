import { createDispatchMap } from '@ngxs/store';

import { CookieService } from 'ngx-cookie-service';

import { inject, Injectable } from '@angular/core';

import { ClearCurrentUser } from '@osf/core/store/user';
import { urlParam } from '@osf/shared/helpers';
import { JsonApiService } from '@osf/shared/services';

import { SignUpModel } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly cookieService = inject(CookieService);
  private readonly actions = createDispatchMap({ clearCurrentUser: ClearCurrentUser });

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

  logout(): void {
    this.cookieService.deleteAll();
    this.actions.clearCurrentUser();
    window.location.href = `${environment.webUrl}/logout/?next=${encodeURIComponent('/')}`;
  }

  register(payload: SignUpModel) {
    const baseUrl = `${environment.apiUrlV1}/register/`;
    const body = { ...payload, 'g-recaptcha-response': payload.recaptcha, campaign: null };

    return this.jsonApiService.post(baseUrl, body);
  }

  forgotPassword(email: string) {
    const baseUrl = `${environment.apiUrl}/users/reset_password/`;
    const params: Record<string, string> = { email };

    return this.jsonApiService.get(baseUrl, params);
  }

  resetPassword(userId: string, token: string, newPassword: string) {
    const baseUrl = `${environment.apiUrl}/users/reset_password/`;
    const body = {
      data: {
        attributes: {
          uid: userId,
          token,
          new_password: newPassword,
        },
      },
    };

    return this.jsonApiService.post(baseUrl, body);
  }
}
