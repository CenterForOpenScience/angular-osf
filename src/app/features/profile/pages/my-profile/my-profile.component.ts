import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { ProfileInformationComponent, ProfileSearchComponent } from '@osf/features/profile/components';
import { SetUserProfile } from '@osf/features/profile/store';

@Component({
  selector: 'osf-my-profile',
  imports: [ProfileInformationComponent, ProfileSearchComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnInit {
  private router = inject(Router);
  private actions = createDispatchMap({
    setUserProfile: SetUserProfile,
  });

  currentUser = select(UserSelectors.getCurrentUser);

  ngOnInit(): void {
    const user = this.currentUser();
    if (user) {
      this.actions.setUserProfile(user);
    }
  }

  toProfileSettings() {
    this.router.navigate(['settings/profile-settings']);
  }
}
