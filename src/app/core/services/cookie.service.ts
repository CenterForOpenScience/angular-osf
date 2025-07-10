import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  getCookie(name: string): string | null {
    try {
      if (!document.cookie) {
        return null;
      }

      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) {
        const cookieValue = parts.pop()?.split(';').shift();
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      }

      return null;
    } catch (error) {
      console.warn(`Failed to read cookie '${name}':`, error);
      return null;
    }
  }

  getCsrfToken(): string | null {
    return this.getCookie(environment.cookieAuth.csrfCookieName);
  }

  hasSessionCookie(): boolean {
    return this.getCookie('sessionid') !== null;
  }

  clearAuthCookies(): void {
    const cookiesToClear = ['sessionid', 'csrftoken', 'api-csrf'];

    cookiesToClear.forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  }
}
