import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { firstValueFrom } from 'rxjs';
import { LoginCredentials, AuthResponse } from './auth.entity';
import { SetAuthToken, ClearAuth } from '@core/store/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #API_URL = 'VALID_API_URL';
  readonly #AUTH_TOKEN_KEY = '';

  readonly #http: HttpClient = inject(HttpClient);
  readonly #store: Store = inject(Store);

  //TODO: rewrite/refactor methods according to the API
  async login(credentials: LoginCredentials): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.#http.post<AuthResponse>(
          `${this.#API_URL}/auth/login`,
          credentials,
        ),
      );

      if (response.accessToken) {
        this.#setAuthToken(response.accessToken);
        this.#store.dispatch(new SetAuthToken(response.accessToken));
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.#AUTH_TOKEN_KEY);
    this.#store.dispatch(new ClearAuth());
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.#AUTH_TOKEN_KEY);
  }

  #setAuthToken(token: string): void {
    localStorage.setItem(this.#AUTH_TOKEN_KEY, token);
  }

  // not sure if it's gonna be used, comment out for now

  // #checkInitialAuthState(): void {
  //   const token: string | null = this.getAuthToken();
  //   if (token) {
  //     this.#store.dispatch(new SetAuthToken(token));
  //   }
  // }
}
