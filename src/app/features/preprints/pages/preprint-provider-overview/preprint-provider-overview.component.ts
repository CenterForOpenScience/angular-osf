import { createDispatchMap, select } from '@ngxs/store';

import { map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { AdvisoryBoardComponent, BrowseBySubjectsComponent } from '@osf/features/preprints/components';
import { PreprintProviderHeroComponent } from '@osf/features/preprints/components/preprint-provider-hero/preprint-provider-hero.component';
import { BrandService } from '@osf/features/preprints/services';
import {
  GetHighlightedSubjectsByProviderId,
  GetPreprintProviderById,
  PreprintsSelectors,
} from '@osf/features/preprints/store';

@Component({
  selector: 'osf-provider-overview',
  imports: [AdvisoryBoardComponent, BrowseBySubjectsComponent, PreprintProviderHeroComponent],
  templateUrl: './preprint-provider-overview.component.html',
  styleUrl: './preprint-provider-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintProviderOverviewComponent implements OnInit {
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
      }
    });
  }

  ngOnInit() {
    this.actions.getPreprintProviderById(this.providerId());
    this.actions.getHighlightedSubjectsByProviderId(this.providerId());
  }
}
