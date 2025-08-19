import { select, Store } from '@ngxs/store';

import { Chip } from 'primeng/chip';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { GetAllOptions } from '@osf/features/profile/components/filters/store';
import { ProfileSelectors } from '@osf/features/profile/store';
import { FilterType } from '@osf/shared/enums';

import {
  ProfileResourceFiltersSelectors,
  SetDateCreated,
  SetFunder,
  SetInstitution,
  SetLicense,
  SetPartOfCollection,
  SetProvider,
  SetResourceType,
  SetSubject,
} from '../profile-resource-filters/store';

@Component({
  selector: 'osf-profile-filter-chips',
  imports: [Chip],
  templateUrl: './profile-filter-chips.component.html',
  styleUrl: './profile-filter-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFilterChipsComponent {
  readonly store = inject(Store);

  protected filters = select(ProfileResourceFiltersSelectors.getAllFilters);

  readonly isMyProfilePage = select(ProfileSelectors.getIsMyProfile);

  clearFilter(filter: FilterType) {
    switch (filter) {
      case FilterType.DateCreated:
        this.store.dispatch(new SetDateCreated(''));
        break;
      case FilterType.Funder:
        this.store.dispatch(new SetFunder('', ''));
        break;
      case FilterType.Subject:
        this.store.dispatch(new SetSubject('', ''));
        break;
      case FilterType.License:
        this.store.dispatch(new SetLicense('', ''));
        break;
      case FilterType.ResourceType:
        this.store.dispatch(new SetResourceType('', ''));
        break;
      case FilterType.Institution:
        this.store.dispatch(new SetInstitution('', ''));
        break;
      case FilterType.Provider:
        this.store.dispatch(new SetProvider('', ''));
        break;
      case FilterType.PartOfCollection:
        this.store.dispatch(new SetPartOfCollection('', ''));
        break;
    }

    this.store.dispatch(GetAllOptions);
  }

  protected readonly FilterType = FilterType;
}
