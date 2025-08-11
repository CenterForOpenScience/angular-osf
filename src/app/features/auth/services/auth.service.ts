import { createDispatchMap } from '@ngxs/store';

import { CookieService } from 'ngx-cookie-service';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { SetAuthenticated } from '@osf/features/auth/store';

import { SignUpModel } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly cookieService = inject(CookieService);
  private readonly actions = createDispatchMap({ setAuthenticated: SetAuthenticated });

  isAuthenticated(): boolean {
    const csrfToken = this.cookieService.get('api-csrf');
    const authenticated = !!csrfToken;

    this.actions.setAuthenticated(authenticated);
    return authenticated;
  }

  logout(): void {
    this.cookieService.deleteAll();
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
