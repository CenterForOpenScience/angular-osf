import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileSearchComponent } from '../../components';
import { ProfileInformationComponent } from '../../components/profile-information/profile-information.component';
import { GetUserProfile, ProfileSelectors, SetIsMyProfile } from '../../store';

@Component({
  selector: 'osf-user-profile',
  imports: [ProfileInformationComponent, ProfileSearchComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);

  currentUser = select(ProfileSelectors.getUserProfile);
  isLoading = select(ProfileSelectors.getIsUserProfile);

  readonly actions = createDispatchMap({
    setIsMyProfile: SetIsMyProfile,
    getUserProfile: GetUserProfile,
  });

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];

    if (userId) {
      this.actions.getUserProfile(userId);
    }
  }

  ngOnDestroy(): void {
    this.actions.setIsMyProfile(false);
  }
}
