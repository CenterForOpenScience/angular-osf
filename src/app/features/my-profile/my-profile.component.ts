import { Store } from '@ngxs/store';

import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { MyProfileSearchComponent } from '@osf/features/my-profile/components/my-profile-search/my-profile-search.component';
import { ResetFiltersState } from '@osf/features/search/components/resources/components/resource-filters/store/resource-filters.actions';
import { ResetSearchState, SetIsMyProfile } from '@osf/features/search/store';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';
import { ResourceTab } from '@shared/entities/resource-card/resource-tab.enum';

@Component({
  selector: 'osf-my-profile',
  imports: [
    Button,
    DatePipe,
    NgOptimizedImage,
    AccordionModule,
    FormsModule,
    ReactiveFormsModule,
    MyProfileSearchComponent,
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

  protected createDate(year: number | string, month: number): Date {
    return new Date(+year, month - 1);
  }
}
