import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { ConfigModel, ConfigModelType } from '@core/models/config.model';

/**
 * Service for managing and accessing configuration values loaded from a JSON file.
 * Config values are stored as signals to enable reactive access in Angular components.
 */
@Injectable({ providedIn: 'root' })
export class OSFConfigService {
  /**
   * Internal map of config keys to reactive signals.
   * Each key corresponds to a configuration field, and its value is a WritableSignal holding the config value.
   */
  private configMap = new Map<string, WritableSignal<ConfigModelType>>();

  /**
   * HTTP client used to fetch the configuration file.
   */
  private http: HttpClient = inject(HttpClient);

  /**
   * Flag to ensure config is only loaded once.
   */
  private isLoaded = false;

  /**
   * Loads the configuration file from `/assets/config/config.json`.
   * Populates `configMap` with keys and reactive signals.
   * If a key already exists, it updates the signal value instead.
   */
  private load(): void {
    this.http.get<ConfigModel>('/assets/config/config.json').subscribe({
      next: (config: ConfigModel) => {
        for (const key of Object.keys(config) as (keyof ConfigModel)[]) {
          const keyString = key as string;
          const value = config[key];

          if (this.configMap.has(keyString)) {
            this.configMap.get(keyString)!.set(value);
          } else {
            this.configMap.set(keyString, signal(value));
          }
          this.isLoaded = true;
        }
      },
    });
  }

  /**
   * Retrieves a reactive signal for a given config key.
   * If the config is not yet loaded, it triggers the loading process.
   * If the key does not exist, it initializes the signal with `null`.
   *
   * @param key - The configuration key to retrieve.
   * @returns A `Signal<ConfigModelType>` representing the value of the key.
   */
  get(key: string): Signal<ConfigModelType> {
    if (!this.isLoaded) {
      this.load();
    }

    if (!this.configMap.has(key)) {
      this.configMap.set(key, signal<ConfigModelType>(null));
    }
    return this.configMap.get(key)!;
  }
}
