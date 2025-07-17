import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { Select } from 'primeng/select';

import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { Primitive } from '@core/helpers';
import { SetSortBy } from '@osf/features/collections/store/collections';
import { GetResourcesByLink } from '@osf/features/my-profile/store';
import { PreprintsFilterChipsComponent, PreprintsResourcesFiltersComponent } from '@osf/features/preprints/components';
import { PreprintsDiscoverSelectors } from '@osf/features/preprints/store/preprints-discover';
import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { PreprintsResourcesFiltersOptionsSelectors } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { ResourceCardComponent } from '@osf/shared/components';
import { searchSortingOptions } from '@osf/shared/constants';
import { IS_WEB, IS_XSMALL } from '@osf/shared/utils';

@Component({
  selector: 'osf-preprints-resources',
  imports: [
    Select,
    FormsModule,
    PreprintsResourcesFiltersComponent,
    PreprintsFilterChipsComponent,
    DataView,
    ResourceCardComponent,
    Button,
    TranslatePipe,
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

  isSortingOpen = signal(false);
  isFiltersOpen = signal(false);

  isAnyFilterSelected = select(PreprintsResourcesFiltersSelectors.getAllFilters);
  isAnyFilterOptions = select(PreprintsResourcesFiltersOptionsSelectors.isAnyFilterOptions);

  switchPage(link: string) {
    this.actions.getResourcesByLink(link);
  }

  switchMobileFiltersSectionVisibility() {
    this.isFiltersOpen.set(!this.isFiltersOpen());
    this.isSortingOpen.set(false);
  }

  switchMobileSortingSectionVisibility() {
    this.isSortingOpen.set(!this.isSortingOpen());
    this.isFiltersOpen.set(false);
  }

  sortOptionSelected(value: Primitive) {
    this.actions.setSortBy(value as string);
  }
}
