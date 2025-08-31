import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProfileInformationComponent } from '@osf/features/profile/components';
import { FetchUserProfile, ProfileSelectors } from '@osf/features/profile/store';
import { OsfSearchComponent } from '@shared/components';
import { SEARCH_TAB_OPTIONS } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { SetDefaultFilterValue } from '@shared/stores/osf-search';

@Component({
  selector: 'osf-user-profile',
  imports: [ProfileInformationComponent, OsfSearchComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private actions = createDispatchMap({
    fetchUserProfile: FetchUserProfile,
    setDefaultFilterValue: SetDefaultFilterValue,
  });

  currentUser = select(ProfileSelectors.getUserProfile);
  isUserLoading = select(ProfileSelectors.isUserProfileLoading);

  resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceTab.Users);

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];

    if (userId) {
      this.actions.fetchUserProfile(userId).subscribe({
        next: () => {
          this.actions.setDefaultFilterValue('creator', this.currentUser()!.iri!);
        },
      });
    }
  }
}
