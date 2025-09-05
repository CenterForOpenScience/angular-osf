import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@osf/core/store/user';
import { SortOrder } from '@osf/shared/enums';
import { SearchFilters } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { TABLE_PARAMS } from '@shared/constants';
import { InstitutionsSearchSelectors } from '@shared/stores/institutions-search';

import { AdminTableComponent } from '../../components';
import { projectTableColumns } from '../../constants';
import { ContactDialogComponent } from '../../dialogs';
import { ContactOption, DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { mapProjectToTableCellData } from '../../mappers';
import { ContactDialogData, InstitutionProject, TableCellData, TableCellLink, TableIconClickEvent } from '../../models';
import { FetchProjects, InstitutionsAdminSelectors, RequestProjectAccess, SendUserMessage } from '../../store';

@Component({
  selector: 'osf-institutions-projects',
  imports: [AdminTableComponent, TranslatePipe],
  templateUrl: './institutions-projects.component.html',
  styleUrl: './institutions-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class InstitutionsProjectsComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);

  private readonly actions = createDispatchMap({
    fetchProjects: FetchProjects,
    sendUserMessage: SendUserMessage,
    requestProjectAccess: RequestProjectAccess,
  });

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

  sortParam = computed(() => {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    return sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;
  });

  ngOnInit(): void {
    this.actions.fetchProjects(this.sortField(), '');
  }

  onSortChange(params: SearchFilters): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    this.actions.fetchProjects(this.sortParam());
  }

  onLinkPageChange(linkUrl: string): void {
    if (!linkUrl) return;

    const cursor = new URL(linkUrl).searchParams.get('page[cursor]') || '';
    this.actions.fetchProjects(this.sortParam(), cursor);
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
          this.institution().id,
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
          institutionId: this.institution()!.id,
          permission: emailData.permission || '',
          messageText: emailData.emailContent,
          bccSender: emailData.ccSender,
          replyTo: emailData.allowReplyToSender,
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.toastService.showSuccess('adminInstitutions.institutionUsers.requestSent'));
    }
  }

  protected readonly TABLE_PARAMS = TABLE_PARAMS;
}
