import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ScheduledBannerComponent } from '@core/components/osf-banners/scheduled-banner/scheduled-banner.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { FetchInstitutions, InstitutionsSelectors } from '@osf/shared/stores/institutions';

@Component({
  selector: 'osf-institutions-list',
  imports: [
    RouterLink,
    TranslatePipe,
    NgOptimizedImage,
    SubHeaderComponent,
    SearchInputComponent,
    LoadingSpinnerComponent,
    ScheduledBannerComponent,
  ],
  templateUrl: './institutions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsListComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly destroyRef = inject(DestroyRef);

  private readonly actions = createDispatchMap({ getInstitutions: FetchInstitutions });

  searchControl = new FormControl('');

  institutions = select(InstitutionsSelectors.getInstitutions);
  institutionsLoading = select(InstitutionsSelectors.isInstitutionsLoading);

  constructor() {
    this.actions.getInstitutions();
    this.setupSearchSubscription();
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchControl) => this.actions.getInstitutions(searchControl ?? ''));
  }
}
