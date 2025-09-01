import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DialogService } from 'primeng/dynamicdialog';

import { filter } from 'rxjs';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { UserSelectors } from '@osf/core/store/user';
import { TABLE_PARAMS } from '@osf/shared/constants';
import { SortOrder } from '@osf/shared/enums';
import { Institution, QueryParams } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import { InstitutionsSearchSelectors } from '@osf/shared/stores';

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
  private readonly route = inject(ActivatedRoute);
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

  ngOnInit(): void {
    this.getProjects();
  }

  onSortChange(params: QueryParams): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    const sortField = params.sortColumn || '-dateModified';
    const sortOrder = params.sortOrder || 1;
    const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchProjects(this.institutionId, institutionIris, this.currentPageSize(), sortParam, '');
  }

  onLinkPageChange(linkUrl: string): void {
    if (!linkUrl) return;

    const cursor = this.extractCursorFromUrl(linkUrl);

    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    const sortParam = sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchProjects(this.institutionId, institutionIris, this.currentPageSize(), sortParam, cursor);
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

  private getProjects(): void {
    const institutionId = this.route.parent?.snapshot.params['institution-id'];
    if (!institutionId) return;

    this.institutionId = institutionId;

    const institution = this.institution() as Institution;
    const institutionIris = institution.iris || [];

    this.actions.fetchProjects(this.institutionId, institutionIris, this.currentPageSize(), this.sortField(), '');
  }

  private extractCursorFromUrl(url: string): string {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('page[cursor]') || '';
  }
}
