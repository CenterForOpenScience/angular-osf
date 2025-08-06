import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { SignUpModel } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly jsonApiService = inject(JsonApiService);

  readonly http: HttpClient = inject(HttpClient);

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
