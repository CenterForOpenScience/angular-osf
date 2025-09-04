import { createDispatchMap, select } from '@ngxs/store';

import { DialogService } from 'primeng/dynamicdialog';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RegistryProviderHeroComponent } from '@osf/features/registries/components/registry-provider-hero/registry-provider-hero.component';
import {
  GetRegistryProviderBrand,
  RegistriesProviderSearchSelectors,
} from '@osf/features/registries/store/registries-provider-search';
import { GlobalSearchComponent } from '@shared/components';
import { ResourceType } from '@shared/enums';
import { SetDefaultFilterValue, SetResourceType } from '@shared/stores/global-search';

@Component({
  selector: 'osf-registries-provider-search',
  imports: [RegistryProviderHeroComponent, GlobalSearchComponent],
  templateUrl: './registries-provider-search.component.html',
  styleUrl: './registries-provider-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class RegistriesProviderSearchComponent implements OnInit {
  private route = inject(ActivatedRoute);

  private actions = createDispatchMap({
    getProvider: GetRegistryProviderBrand,
    setDefaultFilterValue: SetDefaultFilterValue,
    setResourceType: SetResourceType,
  });

  provider = select(RegistriesProviderSearchSelectors.getBrandedProvider);
  isProviderLoading = select(RegistriesProviderSearchSelectors.isBrandedProviderLoading);

  searchControl = new FormControl('');

  ngOnInit(): void {
    const providerName = this.route.snapshot.params['name'];
    if (providerName) {
      this.actions.getProvider(providerName).subscribe({
        next: () => {
          this.actions.setDefaultFilterValue('publisher', this.provider()!.iri!);
          this.actions.setResourceType(ResourceType.Registration);
        },
      });
    }
  }
}
