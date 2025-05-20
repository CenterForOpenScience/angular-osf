import { Store } from '@ngxs/store';

import { AccordionModule } from 'primeng/accordion';
import { Button } from 'primeng/button';

import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user/user.selectors';
import { ResetSearchState, SetIsMyProfile } from '@osf/features/search/store';
import {
  ResetFiltersState,
  SetCreator,
} from '@osf/shared/components/resources/resource-filters/store/resource-filters.actions';
import { IS_XSMALL } from '@osf/shared/utils/breakpoints.tokens';

import { ResourceTab } from '../search/models/resource-tab.enum';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'osf-my-profile',
  imports: [Button, DatePipe, NgOptimizedImage, AccordionModule, FormsModule, ReactiveFormsModule, SearchComponent],
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
    this.#store.dispatch(new SetIsMyProfile(true));

    effect(() => {
      this.#store.dispatch(new SetCreator(this.currentUser()?.fullName ?? '', this.currentUser()?.iri ?? ''));
    });
  }

  ngOnDestroy(): void {
    this.#store.dispatch(ResetFiltersState);
    this.#store.dispatch(ResetSearchState);
    this.#store.dispatch(new SetIsMyProfile(false));
  }
}
