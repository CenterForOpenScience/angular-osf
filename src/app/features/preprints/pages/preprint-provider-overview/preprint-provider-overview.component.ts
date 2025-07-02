import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { AdvisoryBoardComponent, BrowseBySubjectsComponent } from '@osf/features/preprints/components';
import { PreprintProviderFooterComponent } from '@osf/features/preprints/components/preprint-provider-footer/preprint-provider-footer.component';
import { PreprintProviderHeroComponent } from '@osf/features/preprints/components/preprint-provider-hero/preprint-provider-hero.component';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  PreprintsSelectors,
} from '@osf/features/preprints/store/preprints';
import { BrandService } from '@shared/services';
import { BrowserTabHelper, HeaderStyleHelper } from '@shared/utils';

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
  preprintProvider = select(PreprintsSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);

  highlightedSubjectsByProviderId = select(PreprintsSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintsSelectors.areSubjectsLoading);

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
