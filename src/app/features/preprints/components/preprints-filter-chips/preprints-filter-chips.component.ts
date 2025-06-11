import { createDispatchMap, select } from '@ngxs/store';

import { PrimeTemplate } from 'primeng/api';
import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  PreprintsResourcesFiltersSelectors,
  SetCreator,
  SetDateCreated,
  SetLicense,
  SetProvider,
  SetSubject,
} from '@osf/features/preprints/store/preprints-resources-filters';
import { GetAllOptions } from '@osf/features/preprints/store/preprints-resources-filters-options';
import { FilterType } from '@osf/shared/enums';

@Component({
  selector: 'osf-preprints-filter-chips',
  imports: [Chip, PrimeTemplate],
  templateUrl: './preprints-filter-chips.component.html',
  styleUrl: './preprints-filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsFilterChipsComponent {
  protected readonly FilterType = FilterType;
  private readonly actions = createDispatchMap({
    setCreator: SetCreator,
    setDateCreated: SetDateCreated,
    setSubject: SetSubject,
    setLicense: SetLicense,
    setProvider: SetProvider,
    getAllOptions: GetAllOptions,
  });

  filters = select(PreprintsResourcesFiltersSelectors.getAllFilters);

  clearFilter(filter: FilterType) {
    switch (filter) {
      case FilterType.Creator:
        this.actions.setCreator('', '');
        break;
      case FilterType.DateCreated:
        this.actions.setDateCreated('');
        break;
      case FilterType.Subject:
        this.actions.setSubject('', '');
        break;
      case FilterType.License:
        this.actions.setLicense('', '');
        break;
      case FilterType.Provider:
        this.actions.setProvider('', '');
        break;
    }
    this.actions.getAllOptions();
  }
}
