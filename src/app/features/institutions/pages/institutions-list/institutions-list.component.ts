import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoadingSpinnerComponent, SearchInputComponent, SubHeaderComponent } from '@osf/shared/components';
import { FetchInstitutions, InstitutionsSelectors } from '@osf/shared/stores';

@Component({
  selector: 'osf-institutions-list',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    SearchInputComponent,
    NgOptimizedImage,
    LoadingSpinnerComponent,
    RouterLink,
  ],
  templateUrl: './institutions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsListComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
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
