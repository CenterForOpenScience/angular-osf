import { lastValueFrom, shareReplay } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ConfigModel } from '@core/models/config.model';

/**
 * Service for loading and accessing configuration values
 * from the static JSON file at `/assets/config/config.json`.
 *
 * This service ensures that the configuration is only fetched once
 * and made available application-wide via promise-based access.
 *
 * Consumers must call `get()` or `has()` using `await` to ensure
 * that config values are available after loading completes.
 */
@Injectable({ providedIn: 'root' })
export class OSFConfigService {
  /**
   * Angular's HttpClient used to fetch the configuration JSON.
   * Injected via Angular's dependency injection system.
   */
  private http: HttpClient = inject(HttpClient);

  /**
   * Stores the loaded configuration object after it is fetched from the server.
   * Remains `null` until `load()` is successfully called.
   */
  private config: ConfigModel | null = null;

  /**
   * Loads the configuration from the JSON file if not already loaded.
   * Ensures that only one request is made.
   */
  private async load(): Promise<ConfigModel> {
    if (!this.config) {
      this.config = await lastValueFrom<ConfigModel>(
        this.http.get<ConfigModel>('/assets/config/config.json').pipe(shareReplay(1))
      );
    }

    return this.config;
  }

  /**
   * Retrieves a configuration value by key after ensuring the config is loaded.
   * @param key The key to look up in the config.
   * @returns A promise that resolves to the value of the configuration key.
   */
  async get<T extends keyof ConfigModel>(key: T): Promise<ConfigModel[T] | null> {
    if (!this.config) {
      await this.load();
    }

    return this.config?.[key] || null;
  }
}
