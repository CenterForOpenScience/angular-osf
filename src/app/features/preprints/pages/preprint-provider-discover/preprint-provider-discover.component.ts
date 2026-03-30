import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnDestroy, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';
import { SetDefaultFilterValue, SetResourceType } from '@osf/shared/stores/global-search';

import { PreprintProviderHeroComponent } from '../../components';
import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';

@Component({
  selector: 'osf-preprint-provider-discover',
  imports: [PreprintProviderHeroComponent, GlobalSearchComponent],
  templateUrl: './preprint-provider-discover.component.html',
  styleUrl: './preprint-provider-discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderDiscoverComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly brandService = inject(BrandService);
  private readonly headerStyleHelper = inject(HeaderStyleService);
  private readonly browserTabHelper = inject(BrowserTabService);

  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setDefaultFilterValue: SetDefaultFilterValue,
    setResourceType: SetResourceType,
  });

  readonly providerId = this.activatedRoute.snapshot.params['providerId'];

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);

  searchControl = new FormControl('', { nonNullable: true });
  defaultSearchFiltersInitialized = signal<boolean>(false);

  constructor() {
    this.actions.getPreprintProviderById(this.providerId);

    effect(() => {
      const provider = this.preprintProvider();

      if (!provider) {
        return;
      }

      if (!this.defaultSearchFiltersInitialized()) {
        this.actions.setDefaultFilterValue('publisher', provider.iri);
        this.actions.setResourceType(ResourceType.Preprint);
        this.defaultSearchFiltersInitialized.set(true);
      }

      this.brandService.applyBranding(provider.brand);
      this.headerStyleHelper.applyHeaderStyles(
        provider.brand.primaryColor,
        provider.brand.secondaryColor,
        provider.brand.heroBackgroundImageUrl
      );
      this.browserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
    });
  }

  ngOnDestroy() {
    this.headerStyleHelper.resetToDefaults();
    this.brandService.resetBranding();
    this.browserTabHelper.resetToDefaults();
  }
}
