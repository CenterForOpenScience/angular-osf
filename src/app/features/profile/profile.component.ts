import { createDispatchMap, select } from '@ngxs/store';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { GlobalSearchComponent } from '@osf/shared/components/global-search/global-search.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SEARCH_TAB_OPTIONS } from '@osf/shared/constants/search-tab-options.const';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { SetDefaultFilterValue } from '@osf/shared/stores/global-search';
import { UserModel } from '@shared/models/user/user.models';

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
  defaultSearchFiltersInitialized = signal<boolean>(false);

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

  private setupMyProfile(user: UserModel): void {
    this.actions.setUserProfile(user);
    if (user?.iri) {
      this.actions.setDefaultFilterValue('creator,isContainedBy.creator', user.iri);
      this.defaultSearchFiltersInitialized.set(true);
    }
  }

  private setSearchFilter(): void {
    const currentUser = this.user();
    if (currentUser?.iri) {
      this.actions.setDefaultFilterValue('creator,isContainedBy.creator', currentUser.iri);
      this.defaultSearchFiltersInitialized.set(true);
    }
  }
}
