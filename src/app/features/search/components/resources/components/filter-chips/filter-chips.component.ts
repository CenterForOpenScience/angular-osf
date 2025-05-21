import { Store } from '@ngxs/store';

import { PrimeTemplate } from 'primeng/api';
import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GetAllOptions } from '@osf/features/search/components/resources/components/resource-filters/components/filters/store/resource-filters-options.actions';
import { SearchSelectors } from '@osf/features/search/store';
import { FilterType } from '@shared/entities/filters/filter-type.enum';

import {
  ResourceFiltersSelectors,
  SetCreator,
  SetDateCreated,
  SetFunder,
  SetInstitution,
  SetLicense,
  SetPartOfCollection,
  SetProvider,
  SetResourceType,
  SetSubject,
} from 'src/app/features/search/components/resources/components/resource-filters/store';

@Component({
  selector: 'osf-filter-chips',
  imports: [Chip, PrimeTemplate],
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  readonly #store = inject(Store);

  protected filters = this.#store.selectSignal(ResourceFiltersSelectors.getAllFilters);

  readonly isMyProfilePage = this.#store.selectSignal(SearchSelectors.getIsMyProfile);

  clearFilter(filter: FilterType) {
    switch (filter) {
      case FilterType.Creator:
        this.#store.dispatch(new SetCreator('', ''));
        break;
      case FilterType.DateCreated:
        this.#store.dispatch(new SetDateCreated(''));
        break;
      case FilterType.Funder:
        this.#store.dispatch(new SetFunder('', ''));
        break;
      case FilterType.Subject:
        this.#store.dispatch(new SetSubject('', ''));
        break;
      case FilterType.License:
        this.#store.dispatch(new SetLicense('', ''));
        break;
      case FilterType.ResourceType:
        this.#store.dispatch(new SetResourceType('', ''));
        break;
      case FilterType.Institution:
        this.#store.dispatch(new SetInstitution('', ''));
        break;
      case FilterType.Provider:
        this.#store.dispatch(new SetProvider('', ''));
        break;
      case FilterType.PartOfCollection:
        this.#store.dispatch(new SetPartOfCollection('', ''));
        break;
    }
    this.#store.dispatch(GetAllOptions);
  }

  protected readonly FilterType = FilterType;
}
