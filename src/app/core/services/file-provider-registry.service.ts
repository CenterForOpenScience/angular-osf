import { firstValueFrom, timeout } from 'rxjs';

import { HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { FileProvider } from '@osf/features/files/constants';
import { AddonGetListResponseJsonApi } from '@osf/shared/models/addons/external-addon-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

/** Application bootstrap waits for the registry, so the request must not hang. */
export const FILE_PROVIDER_REGISTRY_TIMEOUT_MS = 5000;

/**
 * Registry service that maintains a set of valid file providers.
 * Combines built-in providers with dynamically discovered external storage services.
 *
 * This enables foreign addon support - external storage services registered in
 * gravyvalet are automatically recognized as valid file providers in angular-osf.
 */
@Injectable({
  providedIn: 'root',
})
export class FileProviderRegistryService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  // Set of valid provider names (lowercase)
  private readonly _validProviders = signal<Set<string>>(new Set());

  // Initialization state
  private readonly _initialized = signal(false);
  private _initPromise: Promise<void> | null = null;

  /**
   * Check if a provider name is valid (built-in or external)
   */
  isValidProvider(providerName: string): boolean {
    return this._validProviders().has(providerName.toLowerCase());
  }

  /**
   * Get all valid provider names
   */
  getValidProviders(): string[] {
    return Array.from(this._validProviders());
  }

  /**
   * Check if initialization is complete
   */
  isInitialized(): boolean {
    return this._initialized();
  }

  /**
   * Initialize the registry with built-in and external providers.
   * Safe to call multiple times - subsequent calls return the same promise.
   */
  async initialize(): Promise<void> {
    if (this._initPromise) {
      return this._initPromise;
    }

    this._initPromise = this._doInitialize();
    return this._initPromise;
  }

  private async _doInitialize(): Promise<void> {
    // Start with built-in providers
    const providers = new Set<string>(Object.values(FileProvider).map((p) => p.toLowerCase()));

    // Fetch the names of the external storage services from gravyvalet.
    // The request runs during application bootstrap on every page, so it must stay out of the
    // global error interceptor (no toast, no redirect) and must not block the bootstrap for long.
    try {
      const context = new HttpContext().set(BYPASS_ERROR_INTERCEPTOR, true);
      const params = { 'fields[external-storage-services]': 'external_service_name' };
      const response = await firstValueFrom(
        this.jsonApiService
          .get<AddonGetListResponseJsonApi>(
            `${this.environment.addonsApiUrl}/external-storage-services`,
            params,
            context
          )
          .pipe(timeout(FILE_PROVIDER_REGISTRY_TIMEOUT_MS))
      );

      for (const service of response.data) {
        const serviceName = service.attributes.external_service_name;

        if (serviceName) {
          providers.add(serviceName.toLowerCase());
        }
      }
    } catch {
      // Built-in providers still work; external storage services stay unknown until the next load
    }

    this._validProviders.set(providers);
    this._initialized.set(true);
  }
}
