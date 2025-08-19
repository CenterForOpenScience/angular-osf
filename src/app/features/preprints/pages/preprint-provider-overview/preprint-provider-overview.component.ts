import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintProviderFooterComponent,
  PreprintProviderHeroComponent,
} from '@osf/features/preprints/components';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  PreprintProvidersSelectors,
} from '@osf/features/preprints/store/preprint-providers';
import { BrowserTabHelper, HeaderStyleHelper } from '@osf/shared/helpers';
import { BrandService } from '@shared/services';

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
  private readonly router = inject(Router);
  private providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])) ?? of(undefined));

  private actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });
  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);

  highlightedSubjectsByProviderId = select(PreprintProvidersSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintProvidersSelectors.areSubjectsLoading);

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
    this.actions.getHighlightedSubjectsByProviderId(this.providerId());
  }

  ngOnDestroy() {
    HeaderStyleHelper.resetToDefaults();
    BrandService.resetBranding();
    BrowserTabHelper.resetToDefaults();
  }

  redirectToDiscoverPageWithValue(searchValue: string) {
    this.router.navigate(['discover'], {
      relativeTo: this.route,
      queryParams: { search: searchValue },
    });
  }
}
