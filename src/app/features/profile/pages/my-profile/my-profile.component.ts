import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { GlobalSearchComponent } from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { SetDefaultFilterValue, UpdateFilterValue } from '@osf/shared/stores/global-search';

import { ProfileInformationComponent } from '../../components';
import { SetUserProfile } from '../../store';

@Component({
  selector: 'osf-my-profile',
  imports: [ProfileInformationComponent, GlobalSearchComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnInit {
  private router = inject(Router);
  private actions = createDispatchMap({
    setUserProfile: SetUserProfile,
    updateFilterValue: UpdateFilterValue,
    setDefaultFilterValue: SetDefaultFilterValue,
  });

  currentUser = select(UserSelectors.getCurrentUser);

  resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceType.Agent);

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.actions.setDefaultFilterValue('creator', user.iri!);
    }
  }

  toProfileSettings() {
    this.router.navigate(['settings/profile']);
  }
}
