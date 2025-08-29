import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { PreprintProviderHeroComponent } from '@osf/features/preprints/components';
import { BrowserTabHelper, HeaderStyleHelper } from '@osf/shared/helpers';
import { BrandService } from '@osf/shared/services';

import { GetPreprintProviderById, PreprintProvidersSelectors } from '../../store/preprint-providers';

@Component({
  selector: 'osf-preprint-provider-discover',
  imports: [PreprintProviderHeroComponent],
  templateUrl: './preprint-provider-discover.component.html',
  styleUrl: './preprint-provider-discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderDiscoverComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly activatedRoute = inject(ActivatedRoute);

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
  });

  private providerId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['providerId'])) ?? of(undefined)
  );

  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);

  constructor() {
    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        BrandService.applyBranding(provider.brand);
        HeaderStyleHelper.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
        BrowserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
      }
    });
  }

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
  }
}
