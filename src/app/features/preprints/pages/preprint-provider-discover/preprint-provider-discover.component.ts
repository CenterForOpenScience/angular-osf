import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { PreprintProviderHeroComponent } from '@osf/features/preprints/components/preprint-provider-hero/preprint-provider-hero.component';
import { BrandService } from '@osf/features/preprints/services';
import { GetPreprintProviderById, PreprintsSelectors } from '@osf/features/preprints/store/preprints';
import { HeaderStyleHelper } from '@shared/utils';

@Component({
  selector: 'osf-preprint-provider-discover',
  imports: [PreprintProviderHeroComponent],
  templateUrl: './preprint-provider-discover.component.html',
  styleUrl: './preprint-provider-discover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderDiscoverComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
  });
  preprintProvider = select(PreprintsSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);

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
      }
    });
  }

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
  }
}
