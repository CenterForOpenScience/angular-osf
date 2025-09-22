import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { GlobalSearchComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { User } from '@osf/shared/models';
import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';

import { ProfileInformationComponent } from './components';
import { FetchUserProfile, ProfileSelectors, SetUserProfile } from './store';

@Component({
  selector: 'osf-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileInformationComponent, GlobalSearchComponent, LoadingSpinnerComponent],
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private actions = createDispatchMap({
    fetchUserProfile: FetchUserProfile,
    setDefaultFilterValue: SetDefaultFilterValue,
    setUserProfile: SetUserProfile,
  });

  private loggedInUser = select(UserSelectors.getCurrentUser);
  private userProfile = select(ProfileSelectors.getUserProfile);

  isUserLoading = select(ProfileSelectors.isUserProfileLoading);
  resourceTabOptions = SEARCH_TAB_OPTIONS.filter((x) => x.value !== ResourceType.Agent);

  isMyProfile = computed(() => !this.route.snapshot.params['id']);
  user = computed(() => (this.isMyProfile() ? this.loggedInUser() : this.userProfile()));

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    const currentUser = this.loggedInUser();

    if (userId) {
      this.loadUserProfile(userId);
    } else if (currentUser) {
      this.setupMyProfile(currentUser);
    }
  }

  toProfileSettings(): void {
    this.router.navigate(['settings/profile']);
  }

  private loadUserProfile(userId: string): void {
    this.actions
      .fetchUserProfile(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.setSearchFilter());
  }

  private setupMyProfile(user: User): void {
    this.actions.setUserProfile(user);
    if (user?.iri) {
      this.actions.setDefaultFilterValue('creator,isContainedBy.creator', user.iri);
    }
  }

  private setSearchFilter(): void {
    const currentUser = this.user();
    if (currentUser?.iri) {
      this.actions.setDefaultFilterValue('creator', currentUser.iri);
    }
  }
}
