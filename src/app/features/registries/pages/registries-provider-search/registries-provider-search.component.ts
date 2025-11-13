import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClearCurrentProvider } from '@core/store/provider';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SetDefaultFilterValue, SetResourceType } from '@osf/shared/stores/global-search';
import {
  ClearRegistryProvider,
  GetRegistryProvider,
  RegistrationProviderSelectors,
} from '@osf/shared/stores/registration-provider';

import { RegistryProviderHeroComponent } from '../../components/registry-provider-hero/registry-provider-hero.component';

@Component({
  selector: 'osf-registries-provider-search',
  imports: [RegistryProviderHeroComponent, GlobalSearchComponent],
  templateUrl: './registries-provider-search.component.html',
  styleUrl: './registries-provider-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesProviderSearchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  private actions = createDispatchMap({
    getProvider: GetRegistryProvider,
    setDefaultFilterValue: SetDefaultFilterValue,
    setResourceType: SetResourceType,
    clearCurrentProvider: ClearCurrentProvider,
    clearRegistryProvider: ClearRegistryProvider,
  });

  provider = select(RegistrationProviderSelectors.getBrandedProvider);
  isProviderLoading = select(RegistrationProviderSelectors.isBrandedProviderLoading);
  defaultSearchFiltersInitialized = signal<boolean>(false);

  searchControl = new FormControl('');

  ngOnInit(): void {
    const providerId = this.route.snapshot.params['providerId'];
    if (providerId) {
      this.actions.getProvider(providerId).subscribe({
        next: () => {
          this.actions.setDefaultFilterValue('publisher', this.provider()!.iri!);
          this.actions.setResourceType(ResourceType.Registration);
          this.defaultSearchFiltersInitialized.set(true);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
    this.actions.clearRegistryProvider();
  }
}
