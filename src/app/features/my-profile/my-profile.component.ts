import { Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { EducationHistoryComponent, EmploymentHistoryComponent } from '@osf/shared/components';
import { ResourceTab } from '@osf/shared/enums';
import { IS_XSMALL } from '@osf/shared/utils';

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
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    MyProfileSearchComponent,
    EducationHistoryComponent,
    EmploymentHistoryComponent,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyProfileComponent implements OnDestroy {
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  readonly isMobile = toSignal(inject(IS_XSMALL));

  protected searchValue = signal('');
  protected selectedTab: ResourceTab = ResourceTab.All;
  protected readonly ResourceTab = ResourceTab;

  toProfileSettings() {
    this.#router.navigate(['settings/profile-settings']);
  }

  constructor() {
    // this.#store.dispatch(new SetIsMyProfile(true));
    //
    // effect(() => {
    //   this.#store.dispatch(new SetCreator(this.currentUser()?.fullName ?? '', this.currentUser()?.iri ?? ''));
    // });
  }

  ngOnDestroy(): void {
    this.#store.dispatch(ResetFiltersState);
    this.#store.dispatch(ResetSearchState);
    this.#store.dispatch(new SetIsMyProfile(false));
  }
}
