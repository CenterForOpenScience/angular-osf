import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SortOrder } from '@osf/shared/enums';
import { parseQueryFilterParams } from '@osf/shared/helpers';
import { QueryParams } from '@osf/shared/models';

import { MyProjectsTab } from '../enums';

@Injectable({ providedIn: 'root' })
export class MyProjectsQueryService {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  updateParams(updates: Partial<QueryParams>, currentParams: Record<string, string>, selectedTab: MyProjectsTab): void {
    const queryParams: Record<string, string> = {};

    queryParams['tab'] = String(selectedTab);

    if ('page' in updates || currentParams['page']) {
      queryParams['page'] = updates.page?.toString() ?? currentParams['page'];
    }

    const isBookmarks = selectedTab === MyProjectsTab.Bookmarks;
    if (!isBookmarks && ('size' in updates || currentParams['size'])) {
      queryParams['size'] = updates.size?.toString() ?? currentParams['size'];
    }

    if ('search' in updates || currentParams['search']) {
      const search = updates.search ?? currentParams['search'];
      if (search) {
        queryParams['search'] = search;
      }
    }

    if ('sortColumn' in updates) {
      if (updates.sortColumn) {
        queryParams['sortColumn'] = updates.sortColumn;
        queryParams['sortOrder'] = updates.sortOrder === SortOrder.Desc ? 'desc' : 'asc';
      }
    } else if (currentParams['sortColumn']) {
      queryParams['sortColumn'] = currentParams['sortColumn'];
      queryParams['sortOrder'] = currentParams['sortOrder'];
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  getRawParams(): Record<string, string> {
    return (this.route.snapshot?.queryParams as Record<string, string>) || {};
  }

  toQueryModel(raw: Record<string, string>): QueryParams {
    return parseQueryFilterParams(raw);
  }

  hasTabInUrl(raw: Record<string, string>): boolean {
    return 'tab' in raw;
  }

  getTabFromUrl(raw: Record<string, string>): number | null {
    const tabParam = Number(raw['tab']);
    return !Number.isNaN(tabParam) ? tabParam : null;
  }

  handleSearch(searchValue: string, currentParams: Record<string, string>, selectedTab: MyProjectsTab): void {
    const updates = this.buildSearchUpdates(searchValue, currentParams);
    this.updateParams(updates, currentParams, selectedTab);
  }

  handlePageChange(
    first: number,
    rows: number,
    currentParams: Record<string, string>,
    selectedTab: MyProjectsTab
  ): void {
    const updates = this.buildPageUpdates(first, rows, currentParams);
    this.updateParams(updates, currentParams, selectedTab);
  }

  handleSort(field: string, order: SortOrder, currentParams: Record<string, string>, selectedTab: MyProjectsTab): void {
    const updates = this.buildSortUpdates(field, order);
    this.updateParams(updates, currentParams, selectedTab);
  }

  handleTabSwitch(currentParams: Record<string, string>, selectedTab: MyProjectsTab): void {
    const updates = this.buildTabSwitchUpdates();
    this.updateParams(updates, currentParams, selectedTab);
  }

  private buildSearchUpdates(search: string, current: Record<string, string>): Partial<QueryParams> {
    return {
      search,
      page: 1,
      sortColumn: current['sortColumn'],
      sortOrder: current['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    };
  }

  private buildPageUpdates(first: number, rows: number, current: Record<string, string>): Partial<QueryParams> {
    const page = Math.floor(first / rows) + 1;
    return {
      page,
      size: rows,
      sortColumn: current['sortColumn'],
      sortOrder: current['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc,
    };
  }

  private buildSortUpdates(field: string, order: SortOrder): Partial<QueryParams> {
    return { sortColumn: field, sortOrder: order };
  }

  private buildTabSwitchUpdates(): Partial<QueryParams> {
    return {
      page: 1,
      search: '',
      sortColumn: undefined,
      sortOrder: undefined,
    };
  }
}
