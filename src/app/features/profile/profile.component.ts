import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { ResetFiltersState } from '@osf/features/search/components/resource-filters/store';
import { ResetSearchState } from '@osf/features/search/store';
import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/helpers';

import { ProfileSearchComponent } from './components/profile-search/profile-search.component';
import { SetIsMyProfile } from './store';

@Component({
  selector: 'osf-profile',
  imports: [
    Button,
    DatePipe,
    TranslatePipe,
    NgOptimizedImage,
    ProfileSearchComponent,
    EducationHistoryComponent,
    EmploymentHistoryComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnDestroy {
  private readonly router = inject(Router);

  readonly isMedium = toSignal(inject(IS_MEDIUM));
  readonly currentUser = select(UserSelectors.getCurrentUser);
  readonly actions = createDispatchMap({
    resetFiltersState: ResetFiltersState,
    resetSearchState: ResetSearchState,
    setIsMyProfile: SetIsMyProfile,
  });

  isEmploymentAndEducationVisible = computed(
    () => this.currentUser()?.employment?.length || this.currentUser()?.education?.length
  );

  toProfileSettings() {
    this.router.navigate(['settings/profile-settings']);
  }

  ngOnDestroy(): void {
    this.actions.resetFiltersState();
    this.actions.resetSearchState();
    this.actions.setIsMyProfile(false);
  }
}
