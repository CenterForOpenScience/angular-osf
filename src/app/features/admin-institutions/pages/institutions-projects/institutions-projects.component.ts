import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { filter } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { LoadingSpinnerComponent } from '@osf/shared/components';
import { TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { parseQueryFilterParams } from '@osf/shared/helpers';
import { Institution, QueryParams } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { InstitutionsSearchSelectors } from '@osf/shared/stores';

import { AdminTableComponent } from '../../components';
import { projectTableColumns } from '../../constants';
import { ContactDialogComponent } from '../../dialogs';
import { ContactOption, DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { mapProjectToTableCellData } from '../../mappers';
import {
  ContactDialogData,
  InstitutionProject,
  InstitutionProjectsQueryParamsModel,
  TableCellData,
  TableCellLink,
  TableIconClickEvent,
} from '../../models';
import { FetchProjects, InstitutionsAdminSelectors, RequestProjectAccess, SendUserMessage } from '../../store';

@Component({
  selector: 'osf-institutions-projects',
  imports: [AdminTableComponent, TranslatePipe, LoadingSpinnerComponent],
  templateUrl: './institutions-projects.component.html',
  styleUrl: './institutions-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class InstitutionsProjectsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  private readonly actions = createDispatchMap({
    fetchProjects: FetchProjects,
    sendUserMessage: SendUserMessage,
    requestProjectAccess: RequestProjectAccess,
  });

  institutionId = '';

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
  projectsDownloadLink = select(InstitutionsAdminSelectors.getProjectsDownloadLink);
  institution = select(InstitutionsSearchSelectors.getInstitution);
  currentUser = select(UserSelectors.getCurrentUser);

  tableData = computed(() =>
    this.projects().map((project: InstitutionProject): TableCellData => mapProjectToTableCellData(project))
  );

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

  download(type: DownloadType) {
    downloadResults(this.projectsDownloadLink(), type);
  }

  onIconClick(event: TableIconClickEvent): void {
    switch (event.action) {
      case 'sendMessage': {
        this.dialogService
          .open(ContactDialogComponent, {
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
          .subscribe((data: ContactDialogData) => this.sendEmailToUser(event.rowData, data));
        break;
      }
    }
  }

  private sendEmailToUser(userRowData: TableCellData, emailData: ContactDialogData): void {
    const userId = (userRowData['creator'] as TableCellLink).url.split('/').pop() || '';

    if (emailData.selectedOption === ContactOption.SendMessage) {
      this.actions
        .sendUserMessage(
          userId,
          this.institutionId,
          emailData.emailContent,
          emailData.ccSender,
          emailData.allowReplyToSender
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.toastService.showSuccess('adminInstitutions.institutionUsers.messageSent'));
    } else {
      const projectId = (userRowData['title'] as TableCellLink).url.split('/').pop() || '';

      this.actions
        .requestProjectAccess({
          userId,
          projectId,
          institutionId: this.institutionId,
          permission: emailData.permission || '',
          messageText: emailData.emailContent,
          bccSender: emailData.ccSender,
          replyTo: emailData.allowReplyToSender,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.toastService.showSuccess('adminInstitutions.institutionUsers.requestSent'));
    }
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
