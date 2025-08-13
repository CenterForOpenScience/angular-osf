import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { preprintsTableColumns } from '@osf/features/admin-institutions/constants';
import { mapPreprintToTableData } from '@osf/features/admin-institutions/mappers';
import {
  IndexSearchQueryParamsModel,
  InstitutionProjectsQueryParamsModel,
  TableCellData,
} from '@osf/features/admin-institutions/models';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { LoadingSpinnerComponent } from '@osf/shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';
import { parseQueryFilterParams } from '@shared/helpers';
import { Institution, QueryParams } from '@shared/models';
import { InstitutionsSearchSelectors } from '@shared/stores';

import { FetchPreprints } from '../../store/institutions-admin.actions';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-institutions-preprints',
  imports: [CommonModule, AdminTableComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './institutions-preprints.component.html',
  styleUrl: './institutions-preprints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsPreprintsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly actions = createDispatchMap({
    fetchPreprints: FetchPreprints,
  });

  private institutionId = '';

  institution = select(InstitutionsSearchSelectors.getInstitution);
  preprints = select(InstitutionsAdminSelectors.getPreprints);
  totalCount = select(InstitutionsAdminSelectors.getPreprintsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getPreprintsLoading);
  preprintsLinks = select(InstitutionsAdminSelectors.getPreprintsLinks);

  tableColumns = signal(preprintsTableColumns);
  reportsLink = 'https://drive.google.com/drive/folders/1_aFmeJwLp5xBS3-8clZ4xA9L3UFxdzDd';

  queryParams = toSignal(this.route.queryParams);
  currentPageSize = signal(TABLE_PARAMS.rows);
  currentSort = signal('-dateModified');
  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  currentCursor = signal('');

  tableData = computed(() => {
    const preprintsData = this.preprints();
    return preprintsData.map(mapPreprintToTableData) as TableCellData[];
  });

  downloadLink = computed(() => {
    const institution = this.institution();
    const queryParams = this.queryParams();

    if (!institution?.iris?.length) {
      return '';
    }

    const institutionIris = institution.iris.join(',');
    const baseUrl = `${environment.shareDomainUrl}/index-card-search`;
    let params = new URLSearchParams();
    if (queryParams) {
      params = new URLSearchParams({
        'cardSearchFilter[affiliation][]': institutionIris,
        'cardSearchFilter[resourceType]': 'Preprint',
        'cardSearchFilter[accessService]': environment.webUrl,
        'page[size]': String(queryParams['size'] || this.currentPageSize()),
        sort: queryParams['sort'] || this.currentSort(),
      });
    }

    if (queryParams && queryParams['cursor']) {
      params.append('page[cursor]', queryParams['cursor']);
    }

    return `${baseUrl}?${params.toString()}`;
  });

  constructor() {
    this.setupQueryParamsEffect();
  }

  onSortChange(params: QueryParams): void {
    this.updateQueryParams({
      sort:
        params.sortColumn && params.sortOrder
          ? params.sortOrder === SortOrder.Desc
            ? `-${params.sortColumn}`
            : params.sortColumn
          : undefined,
    });
  }

  onLinkPageChange(link: string): void {
    const url = new URL(link);
    const cursor = url.searchParams.get('page[cursor]') || '';
    this.updateQueryParams({ cursor });
  }

  private setupQueryParamsEffect(): void {
    effect(() => {
      const institutionId = this.route.parent?.snapshot.params['institution-id'];
      const rawQueryParams = this.queryParams();
      if (!rawQueryParams && !institutionId) return;

      this.institutionId = institutionId;
      const parsedQueryParams = this.parseQueryParams(rawQueryParams as Params);

      this.updateComponentState(parsedQueryParams);

      const sortField = parsedQueryParams.sortColumn;
      const sortOrder = parsedQueryParams.sortOrder;
      const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;
      const cursor = parsedQueryParams.cursor;
      const size = parsedQueryParams.size;

      const institution = this.institution() as Institution;
      const institutionIris = institution.iris || [];

      this.actions.fetchPreprints(this.institutionId, institutionIris, size, sortParam, cursor);
    });
  }

  private parseQueryParams(params: Params): InstitutionProjectsQueryParamsModel {
    const parsed = parseQueryFilterParams(params);
    return {
      ...parsed,
      cursor: params['cursor'] || '',
    };
  }

  private updateComponentState(params: InstitutionProjectsQueryParamsModel): void {
    untracked(() => {
      this.currentPageSize.set(params.size);

      if (params.sortColumn) {
        this.sortField.set(params.sortColumn);
        const order = params.sortOrder === SortOrder.Desc ? -1 : 1;
        this.sortOrder.set(order);
      }
    });
  }

  private updateQueryParams(params: IndexSearchQueryParamsModel): void {
    const queryParams: Record<string, string | undefined> = {};

    if (params.sort) {
      queryParams['sort'] = params.sort;
    }
    if (params.cursor) {
      queryParams['cursor'] = params.cursor;
    }
    if (params.size) {
      queryParams['size'] = params.size.toString();
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
