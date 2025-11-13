import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { normalizeQuotes } from '@osf/shared/helpers/normalize-quotes';
import { BrandService } from '@osf/shared/services/brand.service';

import { AdvisoryBoardComponent, BrowseBySubjectsComponent, PreprintServicesComponent } from '../../components';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  GetPreprintProvidersToAdvertise,
  PreprintProvidersSelectors,
} from '../../store/preprint-providers';

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
    TranslatePipe,
    TitleCasePipe,
  ],
  templateUrl: './preprints-landing.component.html',
  styleUrl: './preprints-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsLandingComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  searchControl = new FormControl<string>('');

  private readonly environment = inject(ENVIRONMENT);

  readonly supportEmail = this.environment.supportEmail;
  private readonly OSF_PROVIDER_ID = this.environment.defaultProvider;

  private readonly router = inject(Router);
  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getPreprintProvidersToAdvertise: GetPreprintProvidersToAdvertise,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });

  osfPreprintProvider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.OSF_PROVIDER_ID));
  isPreprintProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  preprintProvidersToAdvertise = select(PreprintProvidersSelectors.getPreprintProvidersToAdvertise);
  highlightedSubjectsByProviderId = select(PreprintProvidersSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintProvidersSelectors.areSubjectsLoading);

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
    const searchValue = normalizeQuotes(this.searchControl.value);

    this.router.navigate(['/search'], {
      queryParams: { search: searchValue, tab: ResourceType.Preprint },
    });
  }
}
