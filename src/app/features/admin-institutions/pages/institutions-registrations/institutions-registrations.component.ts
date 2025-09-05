import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';

import { SortOrder } from '@osf/shared/enums';
import { SearchFilters } from '@osf/shared/models';

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
  private readonly actions = createDispatchMap({ fetchRegistrations: FetchRegistrations });

  institution = select(InstitutionsAdminSelectors.getInstitution);
  registrations = select(InstitutionsAdminSelectors.getRegistrations);
  totalCount = select(InstitutionsAdminSelectors.getRegistrationsTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getRegistrationsLoading);
  registrationsLinks = select(InstitutionsAdminSelectors.getRegistrationsLinks);
  registrationsDownloadLink = select(InstitutionsAdminSelectors.getRegistrationsDownloadLink);

  tableColumns = signal(registrationTableColumns);

  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  tableData = computed(() => this.registrations().map(mapRegistrationToTableData) as TableCellData[]);

  sortParam = computed(() => {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    return sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;
  });

  ngOnInit(): void {
    this.actions.fetchRegistrations(this.sortField(), '');
  }

  onSortChange(params: SearchFilters): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    this.actions.fetchRegistrations(this.sortParam(), '');
  }

  onLinkPageChange(link: string): void {
    const url = new URL(link);
    const cursor = url.searchParams.get('page[cursor]') || '';

    this.actions.fetchRegistrations(this.sortParam(), cursor);
  }

  download(type: DownloadType) {
    downloadResults(this.registrationsDownloadLink(), type);
  }
}
