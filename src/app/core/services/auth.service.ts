import { createDispatchMap } from '@ngxs/store';

import { CookieService } from 'ngx-cookie-service';

import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { SignUpModel } from '@core/models/sign-up.model';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { WINDOW } from '@core/provider/window.provider';
import { CookieConsentService } from '@core/services/cookie-consent.service';
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
  private readonly cookieConsent = inject(CookieConsentService);
  private readonly loaderService = inject(LoaderService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly window = inject(WINDOW);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
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
    if (!this.isBrowser) {
      return;
    }

    this.loaderService.show();

    const serviceUrl = new URL(`${this.webUrl}/login`);
    serviceUrl.searchParams.set('next', this.getPostLoginRedirectUrl());

    const loginUrl = new URL(`${this.casUrl}/login`);
    loginUrl.searchParams.set('service', serviceUrl.toString());

    this.window.location.href = loginUrl.toString();
  }

  navigateToOrcidSignIn(): void {
    if (!this.isBrowser) {
      return;
    }

    const loginUrl = `${this.casUrl}/login?${urlParam({
      redirectOrcid: 'true',
      service: `${this.webUrl}/login`,
      next: this.getPostLoginRedirectUrl(),
    })}`;

    this.window.location.href = loginUrl;
  }

  navigateToInstitutionSignIn(): void {
    if (!this.isBrowser) {
      return;
    }

    const loginUrl = `${this.casUrl}/login?${urlParam({
      campaign: 'institution',
      service: `${this.webUrl}/login`,
      next: this.getPostLoginRedirectUrl(),
    })}`;

    this.window.location.href = loginUrl;
  }

  logout(nextUrl?: string): void {
    this.loaderService.show();
    this.actions.clearCurrentUser();

    if (this.isBrowser) {
      const hasCookieConsent = this.cookieConsent.hasConsent();

      this.cookieService.deleteAll();

      if (hasCookieConsent) {
        this.cookieConsent.accept();
      }

      this.window.location.href = `${this.webUrl}/logout/?next=${encodeURIComponent(nextUrl || `${this.window.location.origin}/`)}`;
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

  resendConfirmationUrl(email: string) {
    const baseUrl = `${this.apiUrl}/resend_confirmation/`;
    const body = {
      data: {
        attributes: {
          email: email,
        },
      },
    };

    return this.jsonApiService.post(baseUrl, body);
  }

  private getPostLoginRedirectUrl(): string {
    const pathname = this.window.location.pathname;
    const excludedPaths = ['/resetpassword', '/forgotpassword', '/register', '/resend'];

    if (excludedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      return `${this.webUrl}/`;
    }

    return this.window.location.href;
  }
}
