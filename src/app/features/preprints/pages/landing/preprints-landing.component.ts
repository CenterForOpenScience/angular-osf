import { createDispatchMap, select } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
} from '@osf/features/preprints/store/preprints';
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
    TitleCasePipe,
  ],
  templateUrl: './preprints-landing.component.html',
  styleUrl: './preprints-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsLandingComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  protected searchControl = new FormControl<string>('');

  private readonly router = inject(Router);
  private readonly OSF_PROVIDER_ID = 'osf';
  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getPreprintProvidersToAdvertise: GetPreprintProvidersToAdvertise,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });

  osfPreprintProvider = select(PreprintsSelectors.getPreprintProviderDetails(this.OSF_PROVIDER_ID));
  isPreprintProviderLoading = select(PreprintsSelectors.isPreprintProviderDetailsLoading);
  preprintProvidersToAdvertise = select(PreprintsSelectors.getPreprintProvidersToAdvertise);
  highlightedSubjectsByProviderId = select(PreprintsSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintsSelectors.areSubjectsLoading);

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

  ngOnDestroy() {
    BrandService.resetBranding();
  }

  redirectToSearchPageWithValue() {
    const searchValue = this.searchControl.value;

    this.router.navigate(['/search'], {
      queryParams: { search: searchValue, resourceTab: ResourceTab.Preprints },
    });
  }
}
