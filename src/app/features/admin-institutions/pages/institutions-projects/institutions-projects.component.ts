import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { parseQueryFilterParams } from '@core/helpers';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { projectTableColumns } from '@osf/features/admin-institutions/constants';
import { mapProjectToTableCellData } from '@osf/features/admin-institutions/mappers';
import { FetchProjects } from '@osf/features/admin-institutions/store/institutions-admin.actions';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store/institutions-admin.selectors';
import { LoadingSpinnerComponent } from '@osf/shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';
import { Institution, QueryParams } from '@shared/models';
import { InstitutionsSearchSelectors } from '@shared/stores';

import { InstitutionProject, InstitutionProjectsQueryParamsModel, TableCellData } from '../../models';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-institutions-projects',
  imports: [AdminTableComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './institutions-projects.component.html',
  styleUrl: './institutions-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsProjectsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly actions = createDispatchMap({
    fetchProjects: FetchProjects,
  });

  institutionId = '';
  reportsLink = 'https://drive.google.com/drive/folders/1_aFmeJwLp5xBS3-8clZ4xA9L3UFxdzDd';

  queryParams = toSignal(this.route.queryParams);
  currentPageSize = signal(TABLE_PARAMS.rows);
  first = signal(0);

  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  tableColumns = projectTableColumns;

  projects = select(InstitutionsAdminSelectors.getProjects);
  totalCount = select(InstitutionsAdminSelectors.getProjectsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getProjectsLoading);
  projectsLinks = select(InstitutionsAdminSelectors.getProjectsLinks);
  institution = select(InstitutionsSearchSelectors.getInstitution);

  tableData = computed(() => {
    return this.projects().map((project: InstitutionProject): TableCellData => mapProjectToTableCellData(project));
  });

  downloadUrl = computed(() => {
    const baseUrl = `${environment.shareDomainUrl}/index-card-search`;
    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];
    const affiliationParam = institutionIris.join(',');

    const params = new URLSearchParams({
      'cardSearchFilter[affiliation][]': affiliationParam,
      'cardSearchFilter[resourceType]': 'Project',
      'cardSearchFilter[accessService]': environment.webUrl,
      'page[cursor]': '',
      'page[size]': '10000',
      sort: this.sortField(),
      withFileName: 'projects-search-results',
      'fields[Project]':
        'title,dateCreated,dateModified,sameAs,storageRegion.prefLabel,storageByteCount,creator.name,usage.viewCount,resourceNature.displayLabel,rights.name,hasOsfAddon.prefLabel,funder.name',
    });

    return `${baseUrl}?${params.toString()}`;
  });

  constructor() {
    this.setupQueryParamsEffect();
  }

  onSortChange(params: QueryParams): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    this.updateQueryParams({
      sortColumn: params.sortColumn || '-dateModified',
      sortOrder: params.sortOrder || 1,
      cursor: '',
    });
  }

  onLinkPageChange(linkUrl: string): void {
    if (!linkUrl) return;

    const cursor = this.extractCursorFromUrl(linkUrl);

    this.updateQueryParams({
      cursor: cursor,
    });
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

      this.actions.fetchProjects(this.institutionId, institutionIris, size, sortParam, cursor);
    });
  }

  private updateQueryParams(updates: Partial<InstitutionProjectsQueryParamsModel>): void {
    const queryParams: Record<string, string | undefined> = {};
    const current = this.route.snapshot.queryParams;

    const same =
      (updates.page?.toString() ?? current['page']) === current['page'] &&
      (updates.size?.toString() ?? current['size']) === current['size'] &&
      (updates.sortColumn ?? current['sortColumn']) === current['sortColumn'] &&
      (updates.sortOrder?.toString() ?? current['sortOrder']) === current['sortOrder'] &&
      (updates.cursor ?? current['cursor']) === current['cursor'];

    if (same) return;

    if ('page' in updates) {
      queryParams['page'] = updates.page!.toString();
    }
    if ('size' in updates) {
      queryParams['size'] = updates.size!.toString();
    }
    if ('sortColumn' in updates) {
      queryParams['sortColumn'] = updates.sortColumn || undefined;
    }
    if ('sortOrder' in updates) {
      queryParams['sortOrder'] = updates.sortOrder?.toString() || undefined;
    }
    if ('cursor' in updates) {
      queryParams['cursor'] = updates.cursor || undefined;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
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
      this.first.set((params.page - 1) * params.size);

      if (params.sortColumn) {
        this.sortField.set(params.sortColumn);
        const order = params.sortOrder === SortOrder.Desc ? -1 : 1;
        this.sortOrder.set(order);
      }
    });
  }

  private extractCursorFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('page[cursor]') || '';
  }
}
