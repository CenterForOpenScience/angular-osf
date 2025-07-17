import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { parseQueryFilterParams } from '@core/helpers';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { registrationTableColumns } from '@osf/features/admin-institutions/constants';
import { mapRegistrationToTableData } from '@osf/features/admin-institutions/mappers';
import {
  IndexSearchQueryParamsModel,
  InstitutionProjectsQueryParamsModel,
  TableCellData,
} from '@osf/features/admin-institutions/models';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store';
import { LoadingSpinnerComponent } from '@osf/shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';
import { Institution, QueryParams } from '@shared/models';
import { InstitutionsSearchSelectors } from '@shared/stores';

import { FetchRegistrations } from '../../store/institutions-admin.actions';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-institutions-registrations',
  imports: [CommonModule, AdminTableComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './institutions-registrations.component.html',
  styleUrl: './institutions-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsRegistrationsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly actions = createDispatchMap({
    fetchRegistrations: FetchRegistrations,
  });

  private institutionId = '';

  institution = select(InstitutionsSearchSelectors.getInstitution);
  registrations = select(InstitutionsAdminSelectors.getRegistrations);
  totalCount = select(InstitutionsAdminSelectors.getRegistrationsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getRegistrationsLoading);
  registrationsLinks = select(InstitutionsAdminSelectors.getRegistrationsLinks);

  tableColumns = signal(registrationTableColumns);
  reportsLink = 'https://drive.google.com/drive/folders/1_aFmeJwLp5xBS3-8clZ4xA9L3UFxdzDd';

  queryParams = toSignal(this.route.queryParams);
  currentPageSize = signal(TABLE_PARAMS.rows);
  currentSort = signal('-dateModified');
  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  tableData = computed(() => {
    const registrationsData = this.registrations();
    return registrationsData.map(mapRegistrationToTableData) as TableCellData[];
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
        'cardSearchFilter[resourceType]': 'Registration',
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

      this.actions.fetchRegistrations(this.institutionId, institutionIris, size, sortParam, cursor);
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
