import { createDispatchMap, select } from '@ngxs/store';

import { map } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { BrandService } from '@osf/shared/services/brand.service';
import { BrowserTabService } from '@osf/shared/services/browser-tab.service';
import { HeaderStyleService } from '@osf/shared/services/header-style.service';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintProviderFooterComponent,
  PreprintProviderHeroComponent,
} from '../../components';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  PreprintProvidersSelectors,
} from '../../store/preprint-providers';

@Component({
  selector: 'osf-preprint-provider-overview',
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
export class PreprintProviderOverviewComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly brandService = inject(BrandService);
  private readonly headerStyleHelper = inject(HeaderStyleService);
  private readonly browserTabHelper = inject(BrowserTabService);

  private readonly providerId = toSignal(this.route.params.pipe(map((params) => params['providerId'])));

  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });
  preprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.providerId()));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);

  highlightedSubjectsByProviderId = select(PreprintProvidersSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintProvidersSelectors.areSubjectsLoading);

  constructor() {
    this.actions.getPreprintProviderById(this.providerId());
    this.actions.getHighlightedSubjectsByProviderId(this.providerId());

    effect(() => {
      const provider = this.preprintProvider();

      if (provider) {
        this.brandService.applyBranding(provider.brand);
        this.headerStyleHelper.applyHeaderStyles(
          provider.brand.primaryColor,
          provider.brand.secondaryColor,
          provider.brand.heroBackgroundImageUrl
        );
        this.browserTabHelper.updateTabStyles(provider.faviconUrl, provider.name);
      }
    });
  }

  ngOnDestroy() {
    this.headerStyleHelper.resetToDefaults();
    this.brandService.resetBranding();
    this.browserTabHelper.resetToDefaults();
  }

  redirectToDiscoverPageWithValue(searchValue: string): void {
    this.router.navigate(['discover'], {
      relativeTo: this.route,
      queryParams: { search: searchValue },
    });
  }
}
