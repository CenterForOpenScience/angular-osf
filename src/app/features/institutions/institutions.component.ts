import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { PaginatorState } from 'primeng/paginator';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { parseQueryFilterParams } from '@core/helpers';
import {
  CustomPaginatorComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { QueryParams } from '@shared/models';
import { FetchInstitutions, InstitutionsSelectors } from '@shared/stores';

@Component({
  selector: 'osf-institutions',
  imports: [
    SubHeaderComponent,
    TranslatePipe,
    SearchInputComponent,
    NgOptimizedImage,
    CustomPaginatorComponent,
    LoadingSpinnerComponent,
    RouterLink,
  ],
  templateUrl: './institutions.component.html',
  styleUrl: './institutions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsComponent {
  @HostBinding('class') classes = 'flex-1 flex flex-column w-full h-full';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly actions = createDispatchMap({ getInstitutions: FetchInstitutions });

  searchControl = new FormControl('');

  queryParams = toSignal(this.route.queryParams);
  currentPage = signal(1);
  currentPageSize = signal(TABLE_PARAMS.rows);
  first = signal(0);

  institutions = select(InstitutionsSelectors.getInstitutions);
  totalInstitutionsCount = select(InstitutionsSelectors.getInstitutionsTotalCount);
  institutionsLoading = select(InstitutionsSelectors.isInstitutionsLoading);

  constructor() {
    this.setupQueryParamsEffect();
    this.setupSearchSubscription();
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ? this.currentPage() + 1 : 1);
    this.first.set(event.first ?? 0);
    this.updateQueryParams({
      page: this.currentPage(),
      size: event.rows,
    });
  }

  private setupQueryParamsEffect(): void {
    effect(() => {
      const rawQueryParams = this.queryParams();
      if (!rawQueryParams) return;

      const parsedQueryParams = parseQueryFilterParams(rawQueryParams);

      this.updateComponentState(parsedQueryParams);

      this.actions.getInstitutions(parsedQueryParams.page, parsedQueryParams.size, parsedQueryParams.search);
    });
  }

  private updateQueryParams(updates: Partial<QueryParams>): void {
    const queryParams: Record<string, string | undefined> = {};

    if ('page' in updates) {
      queryParams['page'] = updates.page!.toString();
    }
    if ('size' in updates) {
      queryParams['size'] = updates.size!.toString();
    }
    if ('search' in updates) {
      queryParams['search'] = updates.search || undefined;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private setupSearchSubscription(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchControl) => {
        this.updateQueryParams({
          search: searchControl ?? '',
          page: 1,
        });
      });
  }

  private updateComponentState(params: QueryParams): void {
    untracked(() => {
      this.currentPage.set(params.page);
      this.currentPageSize.set(params.size);
      this.searchControl.setValue(params.search);
    });
  }
}
