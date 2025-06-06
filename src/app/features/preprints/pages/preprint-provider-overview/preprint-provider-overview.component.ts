import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { AdvisoryBoardComponent, BrowseBySubjectsComponent } from '@osf/features/preprints/components';
import { PreprintProviderFooterComponent } from '@osf/features/preprints/components/preprint-provider-footer/preprint-provider-footer.component';
import { PreprintProviderHeroComponent } from '@osf/features/preprints/components/preprint-provider-hero/preprint-provider-hero.component';
import { BrandService } from '@osf/features/preprints/services';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  PreprintsSelectors,
} from '@osf/features/preprints/store';
import { HeaderStyleService } from '@shared/services';

@Component({
  selector: 'osf-provider-overview',
  imports: [
    AdvisoryBoardComponent,
    BrowseBySubjectsComponent,
    PreprintProviderHeroComponent,
    PreprintProviderFooterComponent,
  ],
  templateUrl: './preprint-provider-overview.component.html',
  styleUrl: './preprint-provider-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderOverviewComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });
  preprintProvider = select(PreprintsSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);

  highlightedSubjectsByProviderId = select(PreprintsSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintsSelectors.areSubjectsLoading);

  constructor() {
    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        BrandService.applyBranding(provider.brand);
        HeaderStyleService.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
      }
    });
  }

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());
    this.actions.getHighlightedSubjectsByProviderId(this.providerId());
  }

  ngOnDestroy() {
    HeaderStyleService.resetToDefaults();
    BrandService.resetBranding();
  }
}
