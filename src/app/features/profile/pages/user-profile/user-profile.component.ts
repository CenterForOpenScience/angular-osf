import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileInformationComponent, ProfileSearchComponent } from '@osf/features/profile/components';
import { FetchUserProfile, ProfileSelectors } from '@osf/features/profile/store';

@Component({
  selector: 'osf-user-profile',
  imports: [ProfileInformationComponent, ProfileSearchComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private actions = createDispatchMap({
    fetchUserProfile: FetchUserProfile,
  });

  currentUser = select(ProfileSelectors.getUserProfile);
  isUserLoading = select(ProfileSelectors.isUserProfileLoading);

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];

    if (userId) {
      this.actions.fetchUserProfile(userId);
    }
  }
}
