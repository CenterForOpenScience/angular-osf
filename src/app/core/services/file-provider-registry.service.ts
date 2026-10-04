import { finalize, firstValueFrom, tap, timeout, TimeoutError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { FileProvider } from '@osf/features/files/constants';
import { AddonGetListResponseJsonApi } from '@osf/shared/models/addons/external-addon-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { LoaderService } from '@osf/shared/services/loader.service';
import { ToastService } from '@osf/shared/services/toast.service';

export const FILE_PROVIDER_REGISTRY_TIMEOUT_MS = 60000;

/**
 * Registry service that maintains a set of valid file provider names.
 * Combines built-in providers with dynamically discovered external storage services.
 */
@Injectable({
  providedIn: 'root',
})
export class FileProviderRegistryService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly loaderService = inject(LoaderService);
  private readonly toastService = inject(ToastService);

  private readonly builtInProviders = new Set<string>(Object.values(FileProvider));
  private readonly reservedNames = new Set<string>(['metadata']);
  private externalProviders: Promise<Set<string>> | null = null;

  /**
   * Check if a provider name is valid (built-in or external).
   *
   * Names are matched exactly: gravyvalet serves its names in lower case, and the Files URLs carry
   * those names as they are. A reserved name is refused and a built-in name is accepted, both
   * without any request. For any other name the external storage services are fetched from
   * gravyvalet first. If that request fails, or is not answered within
   * `FILE_PROVIDER_REGISTRY_TIMEOUT_MS`, the promise rejects.
   */
  async isValidProvider(providerName: string): Promise<boolean> {
    if (this.reservedNames.has(providerName)) {
      return false;
    }

    if (this.builtInProviders.has(providerName)) {
      return true;
    }

    const externalProviders = await this.getExternalProviders();

    return externalProviders.has(providerName);
  }

  private getExternalProviders(): Promise<Set<string>> {
    if (!this.externalProviders) {
      this.externalProviders = this.fetchExternalProviders().catch((error) => {
        // Keep only a successful result, so that the next unknown name asks gravyvalet again
        this.externalProviders = null;
        throw error;
      });
    }

    return this.externalProviders;
  }

  private async fetchExternalProviders(): Promise<Set<string>> {
    const params = { 'fields[external-storage-services]': 'external_service_name' };

    this.loaderService.show();

    const response = await firstValueFrom(
      this.jsonApiService
        .get<AddonGetListResponseJsonApi>(`${this.environment.addonsApiUrl}/external-storage-services`, params)
        .pipe(
          timeout(FILE_PROVIDER_REGISTRY_TIMEOUT_MS),
          tap({
            error: (error) => {
              // A timeout does not pass the error interceptor, so the registry reports it itself
              if (error instanceof TimeoutError) {
                this.toastService.showError('common.errorMessages.serverError');
              }
            },
          }),
          finalize(() => this.loaderService.hide())
        )
    );

    const providers = new Set<string>();

    for (const service of response.data) {
      const serviceName = service.attributes.external_service_name;

      if (serviceName) {
        providers.add(serviceName);
      }
    }

    return providers;
  }
}
