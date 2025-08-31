import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { ProfileInformationComponent } from '@osf/features/profile/components';
import { SetUserProfile } from '@osf/features/profile/store';
import { OsfSearchComponent } from '@shared/components';
import { SEARCH_TAB_OPTIONS } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { SetDefaultFilterValue, UpdateFilterValue } from '@shared/stores/osf-search';

@Component({
  selector: 'osf-my-profile',
  imports: [ProfileInformationComponent, OsfSearchComponent],
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

  resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceTab.Users);

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.actions.setDefaultFilterValue('creator', user.iri!);
    }
  }

  toProfileSettings() {
    this.router.navigate(['settings/profile-settings']);
  }
}
