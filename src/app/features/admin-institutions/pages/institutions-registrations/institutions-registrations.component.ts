import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { Institution, QueryParams } from '@osf/shared/models';
import { InstitutionsSearchSelectors } from '@osf/shared/stores';

import { AdminTableComponent } from '../../components';
import { registrationTableColumns } from '../../constants';
import { DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { mapRegistrationToTableData } from '../../mappers';
import { TableCellData } from '../../models';
import { FetchRegistrations, InstitutionsAdminSelectors } from '../../store';

@Component({
  selector: 'osf-institutions-registrations',
  imports: [CommonModule, AdminTableComponent, TranslatePipe],
  templateUrl: './institutions-registrations.component.html',
  styleUrl: './institutions-registrations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsRegistrationsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly actions = createDispatchMap({ fetchRegistrations: FetchRegistrations });

  private institutionId = '';

  institution = select(InstitutionsSearchSelectors.getInstitution);
  registrations = select(InstitutionsAdminSelectors.getRegistrations);
  totalCount = select(InstitutionsAdminSelectors.getRegistrationsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getRegistrationsLoading);
  registrationsLinks = select(InstitutionsAdminSelectors.getRegistrationsLinks);
  registrationsDownloadLink = select(InstitutionsAdminSelectors.getRegistrationsDownloadLink);

  tableColumns = signal(registrationTableColumns);

  currentPageSize = signal(TABLE_PARAMS.rows);
  currentSort = signal('-dateModified');
  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  tableData = computed(() => this.registrations().map(mapRegistrationToTableData) as TableCellData[]);

  ngOnInit(): void {
    this.getRegistrations();
  }

  onSortChange(params: QueryParams): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    const sortField = params.sortColumn || '-dateModified';
    const sortOrder = params.sortOrder || 1;
    const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchRegistrations(this.institutionId, institutionIris, this.currentPageSize(), sortParam, '');
  }

  onLinkPageChange(link: string): void {
    const url = new URL(link);
    const cursor = url.searchParams.get('page[cursor]') || '';

    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchRegistrations(this.institutionId, institutionIris, this.currentPageSize(), sortParam, cursor);
  }

  download(type: DownloadType) {
    downloadResults(this.registrationsDownloadLink(), type);
  }

  private getRegistrations(): void {
    const institutionId = this.route.parent?.snapshot.params['institution-id'];
    if (!institutionId) return;

    this.institutionId = institutionId;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchRegistrations(this.institutionId, institutionIris, this.currentPageSize(), this.sortField(), '');
  }
}
