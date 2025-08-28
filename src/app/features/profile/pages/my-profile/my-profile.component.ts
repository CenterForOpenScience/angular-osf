import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';

import { ProfileSearchComponent } from '../../components';
import { ProfileInformationComponent } from '../../components/profile-information/profile-information.component';
import { SetIsMyProfile } from '../../store';

@Component({
  selector: 'osf-my-profile',
  imports: [ProfileInformationComponent, ProfileSearchComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnDestroy {
  private readonly router = inject(Router);

  currentUser = select(UserSelectors.getCurrentUser);

  readonly actions = createDispatchMap({
    setIsMyProfile: SetIsMyProfile,
  });

  toProfileSettings() {
    this.router.navigate(['settings/profile-settings']);
  }

  ngOnDestroy(): void {
    this.actions.setIsMyProfile(false);
  }
}
