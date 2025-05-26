import { Store } from '@ngxs/store';

import { PrimeTemplate } from 'primeng/api';
import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FilterType } from '@osf/shared/enums';

import { MyProfileSelectors } from '../../store';
import { GetAllOptions } from '../filters/store';
import {
  MyProfileResourceFiltersSelectors,
  SetDateCreated,
  SetFunder,
  SetInstitution,
  SetLicense,
  SetPartOfCollection,
  SetProvider,
  SetResourceType,
  SetSubject,
} from '../my-profile-resource-filters/store';

@Component({
  selector: 'osf-my-profile-filter-chips',
  imports: [Chip, PrimeTemplate],
  templateUrl: './my-profile-filter-chips.component.html',
  styleUrl: './my-profile-filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileFilterChipsComponent {
  readonly #store = inject(Store);

  protected filters = this.#store.selectSignal(MyProfileResourceFiltersSelectors.getAllFilters);

  readonly isMyProfilePage = this.#store.selectSignal(MyProfileSelectors.getIsMyProfile);

  clearFilter(filter: FilterType) {
    switch (filter) {
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
