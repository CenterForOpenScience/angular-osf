import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostBinding, inject, OnDestroy } from '@angular/core';
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
  selector: 'osf-preprints-landing',
  imports: [
    Button,
    Skeleton,
    RouterLink,
    SearchInputComponent,
    AdvisoryBoardComponent,
    PreprintServicesComponent,
    BrowseBySubjectsComponent,
    TranslatePipe,
    TitleCasePipe,
  ],
  templateUrl: './preprints-landing.component.html',
  styleUrl: './preprints-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsLandingComponent implements OnDestroy {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly environment = inject(ENVIRONMENT);
  private readonly brandService = inject(BrandService);
  private readonly router = inject(Router);

  readonly supportEmail = this.environment.supportEmail;
  private readonly defaultProviderId = this.environment.defaultProvider;

  searchControl = new FormControl('', { nonNullable: true });

  private readonly actions = createDispatchMap({
    getPreprintProviderById: GetPreprintProviderById,
    getPreprintProvidersToAdvertise: GetPreprintProvidersToAdvertise,
    getHighlightedSubjectsByProviderId: GetHighlightedSubjectsByProviderId,
  });

  provider = select(PreprintProvidersSelectors.getPreprintProviderDetails(this.defaultProviderId));
  isProviderLoading = select(PreprintProvidersSelectors.isPreprintProviderDetailsLoading);
  preprintProvidersToAdvertise = select(PreprintProvidersSelectors.getPreprintProvidersToAdvertise);
  highlightedSubjects = select(PreprintProvidersSelectors.getHighlightedSubjectsForProvider);
  areSubjectsLoading = select(PreprintProvidersSelectors.areSubjectsLoading);

  constructor() {
    this.actions.getPreprintProviderById(this.defaultProviderId);
    this.actions.getPreprintProvidersToAdvertise();
    this.actions.getHighlightedSubjectsByProviderId(this.defaultProviderId);

    effect(() => {
      const provider = this.provider();

      if (provider) {
        this.brandService.applyBranding(provider.brand);
      }
    });
  }

  ngOnDestroy() {
    this.brandService.resetBranding();
  }

  submitSearch(): void {
    const searchValue = normalizeQuotes(this.searchControl.value)?.trim();

    if (!searchValue) {
      return;
    }

    this.router.navigate(['/search'], { queryParams: { search: searchValue, tab: ResourceType.Preprint } });
  }
}
