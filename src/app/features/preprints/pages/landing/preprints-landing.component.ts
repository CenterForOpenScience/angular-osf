import { createDispatchMap, select } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import {
  AdvisoryBoardComponent,
  BrowseBySubjectsComponent,
  PreprintServicesComponent,
} from '@osf/features/preprints/components';
import { BrandService } from '@osf/features/preprints/services';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  GetPreprintProvidersToAdvertise,
  PreprintsSelectors,
} from '@osf/features/preprints/store';
import { SearchInputComponent } from '@shared/components';
import { ResourceTab } from '@shared/enums';

@Component({
  selector: 'osf-overview',
  imports: [
    Button,
    SearchInputComponent,
    RouterLink,
    AdvisoryBoardComponent,
    PreprintServicesComponent,
    BrowseBySubjectsComponent,
    Skeleton,
    TranslateModule,
  ],
  templateUrl: './preprints-landing.component.html',
  styleUrl: './preprints-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsLandingComponent implements OnInit {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';
  private readonly router = inject(Router);
  private readonly OSF_PROVIDER_ID = 'osf';
  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getPreprintProvidersToAdvertise: GetPreprintProvidersToAdvertise,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });

  osfPreprintProvider = select(PreprintsSelectors.getPreprintProviderDetails);
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);
  preprintProvidersToAdvertise = select(PreprintsSelectors.getPreprintProvidersToAdvertise);
  highlightedSubjectsByProviderId = select(PreprintsSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintsSelectors.areSubjectsLoading);

  addPreprint() {
    // [RNi] TODO: Implement the logic to add a preprint.
  }

  constructor() {
    effect(() => {
      const provider = this.osfPreprintProvider();

      if (provider) {
        BrandService.applyBranding(provider.brand);
      }
    });
  }

  ngOnInit(): void {
    this.actions.getPreprintProviderById(this.OSF_PROVIDER_ID);
    this.actions.getPreprintProvidersToAdvertise();
    this.actions.getHighlightedSubjectsByProviderId(this.OSF_PROVIDER_ID);
  }

  redirectToSearchPageWithValue(searchValue: string) {
    this.router.navigate(['/search'], {
      queryParams: { search: searchValue, resourceTab: ResourceTab.Preprints },
    });
  }
}
