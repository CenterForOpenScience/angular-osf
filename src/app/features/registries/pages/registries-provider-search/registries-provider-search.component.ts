import { createDispatchMap, select } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClearCurrentProvider, SetCurrentProvider } from '@core/store/provider';
import { GlobalSearchComponent } from '@osf/shared/components';
import { ResourceType } from '@osf/shared/enums';
import { SetDefaultFilterValue, SetResourceType } from '@osf/shared/stores/global-search';
import { GetRegistryProviderBrand, RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';

import { RegistryProviderHeroComponent } from '../../components/registry-provider-hero/registry-provider-hero.component';

@Component({
  selector: 'osf-registries-provider-search',
  imports: [RegistryProviderHeroComponent, GlobalSearchComponent],
  templateUrl: './registries-provider-search.component.html',
  styleUrl: './registries-provider-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistriesProviderSearchComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);

  private actions = createDispatchMap({
    getProvider: GetRegistryProviderBrand,
    setDefaultFilterValue: SetDefaultFilterValue,
    setResourceType: SetResourceType,
    setCurrentProvider: SetCurrentProvider,
    clearCurrentProvider: ClearCurrentProvider,
  });

  provider = select(RegistrationProviderSelectors.getBrandedProvider);
  isProviderLoading = select(RegistrationProviderSelectors.isBrandedProviderLoading);

  searchControl = new FormControl('');

  ngOnInit(): void {
    const providerName = this.route.snapshot.params['name'];
    if (providerName) {
      this.actions.getProvider(providerName).subscribe({
        next: () => {
          this.actions.setDefaultFilterValue('publisher', this.provider()!.iri!);
          this.actions.setResourceType(ResourceType.Registration);
          this.actions.setCurrentProvider(this.provider()!);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.actions.clearCurrentProvider();
  }
}
