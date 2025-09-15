import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@osf/core/store/user';
import { SelectComponent } from '@osf/shared/components';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { Primitive } from '@osf/shared/helpers';
import { SearchFilters } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { SortOrder } from '@shared/enums';

import { AdminTableComponent } from '../../components';
import { departmentOptions, userTableColumns } from '../../constants';
import { SendEmailDialogComponent } from '../../dialogs';
import { DownloadType } from '../../enums';
import { camelToSnakeCase } from '../../helpers';
import { mapUserToTableCellData } from '../../mappers';
import { InstitutionUser, SendEmailDialogData, TableCellData, TableCellLink, TableIconClickEvent } from '../../models';
import { FetchInstitutionUsers, InstitutionsAdminSelectors, SendUserMessage } from '../../store';

@Component({
  selector: 'osf-institutions-users',
  imports: [AdminTableComponent, FormsModule, SelectComponent, CheckboxModule, TranslatePipe],
  templateUrl: './institutions-users.component.html',
  styleUrl: './institutions-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class InstitutionsUsersComponent {
  private readonly translate = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  private readonly actions = createDispatchMap({
    fetchInstitutionUsers: FetchInstitutionUsers,
    sendUserMessage: SendUserMessage,
  });

  currentPage = signal(1);
  currentPageSize = signal(DEFAULT_TABLE_PARAMS.rows);
  first = signal(0);

  selectedDepartment = signal<string | null>(null);
  hasOrcidFilter = signal<boolean>(false);

  sortField = signal<string>('user_name');
  sortOrder = signal<number>(1);

  departmentOptions = departmentOptions;
  tableColumns = userTableColumns;

  institution = select(InstitutionsAdminSelectors.getInstitution);
  users = select(InstitutionsAdminSelectors.getUsers);
  totalCount = select(InstitutionsAdminSelectors.getUsersTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getUsersLoading);

  currentUser = select(UserSelectors.getCurrentUser);

  tableData = computed(() => this.users().map((user: InstitutionUser): TableCellData => mapUserToTableCellData(user)));

  amountText = computed(() => {
    const count = this.totalCount();
    return count + ' ' + this.translate.instant('adminInstitutions.summary.totalUsers').toLowerCase();
  });

  constructor() {
    this.setupDataFetchingEffect();
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ? event.page + 1 : 1);
    this.first.set(event.first ?? 0);
    this.currentPageSize.set(event.rows || this.currentPageSize());
  }

  onDepartmentChange(department: Primitive): void {
    const departmentValue = department === null || department === undefined ? null : String(department);
    this.selectedDepartment.set(departmentValue);
    this.currentPage.set(1);
  }

  onOrcidFilterChange(hasOrcid: boolean): void {
    this.hasOrcidFilter.set(hasOrcid);
    this.currentPage.set(1);
  }

  onSortChange(sortEvent: SearchFilters): void {
    this.currentPage.set(1);
    this.sortField.set(camelToSnakeCase(sortEvent.sortColumn) || 'user_name');
    this.sortOrder.set(sortEvent.sortOrder || -1);
  }

  onIconClick(event: TableIconClickEvent): void {
    switch (event.action) {
      case 'sendMessage': {
        this.dialogService
          .open(SendEmailDialogComponent, {
            width: '448px',
            focusOnShow: false,
            header: this.translate.instant('adminInstitutions.institutionUsers.sendEmail'),
            closeOnEscape: true,
            modal: true,
            closable: true,
            data: this.currentUser()?.fullName,
          })
          .onClose.pipe(
            filter((value) => !!value),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((data: SendEmailDialogData) => this.sendEmailToUser(event.rowData, data));
        break;
      }
    }
  }

  download(type: DownloadType) {
    const baseUrl = this.institution().userMetricsUrl;

    if (!baseUrl) {
      return;
    }

    const url = this.createUrl(baseUrl, type);

    window.open(url, '_blank');
  }

  private createUrl(baseUrl: string, mediaType: string): string {
    const filters = this.buildFilters();
    const userURL = new URL(baseUrl);
    userURL.searchParams.set('format', mediaType);
    userURL.searchParams.set('page[size]', '10000');

    Object.entries(filters).forEach(([key, value]) => {
      userURL.searchParams.set(key, value);
    });

    return userURL.toString();
  }

  private setupDataFetchingEffect(): void {
    effect(() => {
      const institutionId = this.institution().id;
      if (!institutionId) {
        return;
      }
      const filters = this.buildFilters();
      const sortField = this.sortField();
      const sortOrder = this.sortOrder();
      const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;

      this.actions.fetchInstitutionUsers(institutionId, this.currentPage(), this.currentPageSize(), sortParam, filters);
    });
  }

  private buildFilters(): Record<string, string> {
    const filters: Record<string, string> = {};

    const department = this.selectedDepartment();
    if (department !== null) {
      filters['filter[department]'] = department;
    }

    if (this.hasOrcidFilter()) {
      filters['filter[orcid_id][ne]'] = '';
    }

    return filters;
  }

  private sendEmailToUser(userRowData: TableCellData, emailData: SendEmailDialogData): void {
    const userId = (userRowData['userLink'] as TableCellLink).text as string;

    this.actions
      .sendUserMessage(
        userId,
        this.institution().id,
        emailData.emailContent,
        emailData.ccSender,
        emailData.allowReplyToSender
      )
      .subscribe(() => this.toastService.showSuccess('adminInstitutions.institutionUsers.messageSent'));
  }
}
