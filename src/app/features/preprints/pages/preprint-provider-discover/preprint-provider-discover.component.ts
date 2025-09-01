import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PreprintProviderHeroComponent } from '@osf/features/preprints/components';
import { BrowserTabHelper, HeaderStyleHelper } from '@osf/shared/helpers';
import { BrandService } from '@osf/shared/services';
import { OsfSearchComponent } from '@shared/components/osf-search/osf-search.component';
import { ResourceType } from '@shared/enums';
import { SetDefaultFilterValue, SetResourceType } from '@shared/stores/osf-search/osf-search.actions';

import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';

@Component({
  selector: 'osf-preprint-provider-discover',
  imports: [PreprintProviderHeroComponent, OsfSearchComponent],
  templateUrl: './preprint-provider-discover.component.html',
  styleUrl: './preprint-provider-discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderDiscoverComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly activatedRoute = inject(ActivatedRoute);

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    setDefaultFilterValue: SetDefaultFilterValue,
    setResourceType: SetResourceType,
  });

  providerId = this.activatedRoute.snapshot.params['providerId'];

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);

  searchControl = new FormControl('');

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId).subscribe({
      next: () => {
        const provider = this.preprintProvider();

        if (provider) {
          this.actions.setDefaultFilterValue('publisher', provider.iri);
          this.actions.setResourceType(ResourceType.Preprint);

          BrandService.applyBranding(provider.brand);
          HeaderStyleHelper.applyHeaderStyles(
            provider.brand.primaryColor,
            provider.brand.secondaryColor,
            provider.brand.heroBackgroundImageUrl
          );
          BrowserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
        }
      },
    });
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
  }
}
