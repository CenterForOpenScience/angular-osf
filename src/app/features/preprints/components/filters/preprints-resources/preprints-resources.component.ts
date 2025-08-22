import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { PreprintsFilterChipsComponent, PreprintsResourcesFiltersComponent } from '@osf/features/preprints/components';
import {
  GetResourcesByLink,
  PreprintsDiscoverSelectors,
  SetSortBy,
} from '@osf/features/preprints/store/preprints-discover';
import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { SearchResultsContainerComponent } from '@osf/shared/components';
import { searchSortingOptions } from '@osf/shared/constants';
import { IS_WEB, IS_XSMALL } from '@osf/shared/helpers';
import { Primitive } from '@shared/helpers';

@Component({
  selector: 'osf-preprints-resources',
  imports: [
    FormsModule,
    SearchResultsContainerComponent,
    PreprintsResourcesFiltersComponent,
    PreprintsFilterChipsComponent,
  ],
  templateUrl: './preprints-resources.component.html',
  styleUrl: './preprints-resources.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsResourcesComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly actions = createDispatchMap({ setSortBy: SetSortBy, getResourcesByLink: GetResourcesByLink });
  searchSortingOptions = searchSortingOptions;

  isWeb = toSignal(inject(IS_WEB));
  isMobile = toSignal(inject(IS_XSMALL));

  resources = select(PreprintsDiscoverSelectors.getResources);
  resourcesCount = select(PreprintsDiscoverSelectors.getResourcesCount);

  sortBy = select(PreprintsDiscoverSelectors.getSortBy);
  first = select(PreprintsDiscoverSelectors.getFirst);
  next = select(PreprintsDiscoverSelectors.getNext);
  prev = select(PreprintsDiscoverSelectors.getPrevious);

  isAnyFilterSelected = select(PreprintsResourcesFiltersSelectors.isAnyFilterSelected);
  isAnyFilterOptions = select(PreprintsResourcesFiltersOptionsSelectors.isAnyFilterOptions);

  switchPage(link: string) {
    this.actions.getResourcesByLink(link);
  }

  sortOptionSelected(value: Primitive) {
    this.actions.setSortBy(value as string);
  }
}
