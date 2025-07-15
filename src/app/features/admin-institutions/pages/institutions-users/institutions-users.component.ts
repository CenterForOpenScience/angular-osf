import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { filter } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { parseQueryFilterParams } from '@core/helpers';
import { UserSelectors } from '@core/store/user';
import { Primitive } from '@osf/core/helpers';
import { AdminTableComponent } from '@osf/features/admin-institutions/components';
import { departmentOptions, userTableColumns } from '@osf/features/admin-institutions/constants';
import { SendEmailDialogComponent } from '@osf/features/admin-institutions/dialogs';
import { mapUserToTableCellData } from '@osf/features/admin-institutions/mappers';
import {
  FetchInstitutionUsers,
  SendUserMessage,
} from '@osf/features/admin-institutions/store/institutions-admin.actions';
import { InstitutionsAdminSelectors } from '@osf/features/admin-institutions/store/institutions-admin.selectors';
import { SelectComponent } from '@osf/shared/components';
import { TABLE_PARAMS } from '@shared/constants';
import { SortOrder } from '@shared/enums';
import { QueryParams } from '@shared/models';

import {
  InstitutionsUsersQueryParamsModel,
  InstitutionUser,
  SendEmailDialogData,
  TableCellData,
  TableCellLink,
  TableIconClickEvent,
} from '../../models';

@Component({
  selector: 'osf-institutions-users',
  imports: [AdminTableComponent, FormsModule, SelectComponent, CheckboxModule, TranslatePipe],
  templateUrl: './institutions-users.component.html',
  styleUrl: './institutions-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class InstitutionsUsersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly actions = createDispatchMap({
    fetchInstitutionUsers: FetchInstitutionUsers,
    sendUserMessage: SendUserMessage,
  });

  institutionId = '';

  queryParams = toSignal(this.route.queryParams);
  currentPage = signal(1);
  currentPageSize = signal(TABLE_PARAMS.rows);
  first = signal(0);

  selectedDepartment = signal<string | null>(null);
  hasOrcidFilter = signal<boolean>(false);

  sortField = signal<string>('user_name');
  sortOrder = signal<number>(1);

  departmentOptions = departmentOptions;
  tableColumns = userTableColumns;

  users = select(InstitutionsAdminSelectors.getUsers);
  totalCount = select(InstitutionsAdminSelectors.getUsersTotalCount);
  isLoading = select(InstitutionsAdminSelectors.getUsersLoading);

  currentUser = select(UserSelectors.getCurrentUser);

  tableData = computed(() => {
    return this.users().map((user: InstitutionUser): TableCellData => mapUserToTableCellData(user));
  });

  amountText = computed(() => {
    const count = this.totalCount();
    return count + ' ' + this.translate.instant('adminInstitutions.summary.totalUsers').toLowerCase();
  });

  constructor() {
    this.setupQueryParamsEffect();
  }

  ngOnInit(): void {
    const institutionId = this.route.parent?.snapshot.params['institution-id'];

    if (institutionId) {
      this.institutionId = institutionId;
    }
  }

  onPageChange(event: PaginatorState): void {
    this.currentPage.set(event.page ? event.page + 1 : 1);
    this.first.set(event.first ?? 0);
    this.updateQueryParams({
      page: this.currentPage(),
      size: event.rows || this.currentPageSize(),
    });
  }

  onDepartmentChange(department: Primitive): void {
    const departmentValue = department === null || department === undefined ? null : String(department);
    this.selectedDepartment.set(departmentValue);
    this.updateQueryParams({
      department: departmentValue,
      page: 1,
    });
  }

  onOrcidFilterChange(hasOrcid: boolean): void {
    this.hasOrcidFilter.set(hasOrcid);
    this.updateQueryParams({
      hasOrcid: hasOrcid,
      page: 1,
    });
  }

  onSortChange(sortEvent: QueryParams): void {
    this.updateQueryParams({
      sortColumn: sortEvent.sortColumn,
      sortOrder: sortEvent.sortOrder,
      page: 1,
    });
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

  private setupQueryParamsEffect(): void {
    effect(() => {
      const rawQueryParams = this.queryParams();
      if (!rawQueryParams) return;

      const parsedQueryParams = this.parseQueryParams(rawQueryParams);
      this.updateComponentState(parsedQueryParams);

      if (this.institutionId) {
        const filters = untracked(() => this.buildFilters());

        const sortField = untracked(() => this.sortField());
        const sortOrder = untracked(() => this.sortOrder());
        const sortParam = sortOrder === -1 ? `-${sortField}` : sortField;

        this.actions.fetchInstitutionUsers(
          this.institutionId,
          parsedQueryParams.page,
          parsedQueryParams.size,
          sortParam,
          filters
        );
      }
    });
  }

  private updateQueryParams(updates: Partial<InstitutionsUsersQueryParamsModel>): void {
    const queryParams: Record<string, string | undefined> = {};

    if ('page' in updates) {
      queryParams['page'] = updates.page!.toString();
    }
    if ('size' in updates) {
      queryParams['size'] = updates.size!.toString();
    }
    if ('department' in updates) {
      queryParams['department'] = updates.department || undefined;
    }
    if ('hasOrcid' in updates) {
      queryParams['hasOrcid'] = updates.hasOrcid ? 'true' : undefined;
    }
    if ('sortColumn' in updates) {
      queryParams['sortColumn'] = updates.sortColumn || undefined;
    }
    if ('sortOrder' in updates) {
      queryParams['sortOrder'] = updates.sortOrder?.toString() || undefined;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private parseQueryParams(params: Params): InstitutionsUsersQueryParamsModel {
    const parsed = parseQueryFilterParams(params);
    return {
      ...parsed,
      department: params['department'] || null,
      hasOrcid: params['hasOrcid'] === 'true',
    };
  }

  private updateComponentState(params: InstitutionsUsersQueryParamsModel): void {
    untracked(() => {
      this.currentPage.set(params.page);
      this.currentPageSize.set(params.size);
      this.first.set((params.page - 1) * params.size);
      this.selectedDepartment.set(params.department || null);
      this.hasOrcidFilter.set(params.hasOrcid || false);

      if (params.sortColumn) {
        this.sortField.set(params.sortColumn);
        const order = params.sortOrder === SortOrder.Desc ? -1 : 1;
        this.sortOrder.set(order);
      }
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

    this.actions.sendUserMessage(
      userId,
      this.institutionId,
      emailData.emailContent,
      emailData.ccSender,
      emailData.allowReplyToSender
    );
  }
}
