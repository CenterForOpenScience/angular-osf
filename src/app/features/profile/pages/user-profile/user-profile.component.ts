import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, HostBinding, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GlobalSearchComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';

import { ProfileInformationComponent } from '../../components';
import { FetchUserProfile, ProfileSelectors } from '../../store';

@Component({
  selector: 'osf-user-profile',
  imports: [ProfileInformationComponent, GlobalSearchComponent, LoadingSpinnerComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  @HostBinding('class') classes = 'flex-1';

  private route = inject(ActivatedRoute);
  private actions = createDispatchMap({
    fetchUserProfile: FetchUserProfile,
    setDefaultFilterValue: SetDefaultFilterValue,
  });

  currentUser = select(ProfileSelectors.getUserProfile);
  isUserLoading = select(ProfileSelectors.isUserProfileLoading);

  resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceType.Agent);

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
