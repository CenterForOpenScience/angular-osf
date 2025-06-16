import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';
import { IS_MEDIUM } from '@osf/shared/utils';

import { ResetFiltersState } from '../search/components/resource-filters/store';
import { ResetSearchState } from '../search/store';

import { MyProfileSearchComponent } from './components';
import { SetIsMyProfile } from './store';

@Component({
  selector: 'osf-my-profile',
  imports: [
    Button,
    DatePipe,
    TranslatePipe,
    NgOptimizedImage,
    MyProfileSearchComponent,
    EducationHistoryComponent,
    EmploymentHistoryComponent,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnDestroy {
  private readonly router = inject(Router);

  readonly isMedium = toSignal(inject(IS_MEDIUM));
  readonly currentUser = select(UserSelectors.getCurrentUser);
  readonly actions = createDispatchMap({
    resetFiltersState: ResetFiltersState,
    resetSearchState: ResetSearchState,
    setIsMyProfile: SetIsMyProfile,
  });

  toProfileSettings() {
    this.router.navigate(['settings/profile-settings']);
  }

  ngOnDestroy(): void {
    this.actions.resetFiltersState();
    this.actions.resetSearchState();
    this.actions.setIsMyProfile(false);
  }
}
