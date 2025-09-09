import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';

import { filter } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserSelectors } from '@osf/core/store/user';
import { FiltersSectionComponent } from '@osf/features/admin-institutions/components/filters-section/filters-section.component';
import { mapProjectResourceToTableCellData } from '@osf/features/admin-institutions/mappers/institution-project-to-table-data.mapper';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { ResourceModel, SearchFilters } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import {
  FetchResources,
  FetchResourcesByLink,
  GlobalSearchSelectors,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
} from '@shared/stores/global-search';

import { AdminTableComponent } from '../../components';
import { projectTableColumns } from '../../constants';
import { ContactDialogComponent } from '../../dialogs';
import { ContactOption, DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { ContactDialogData, TableCellData, TableCellLink, TableIconClickEvent } from '../../models';
import { InstitutionsAdminSelectors, RequestProjectAccess, SendUserMessage } from '../../store';

@Component({
  selector: 'osf-institutions-projects',
  imports: [AdminTableComponent, TranslatePipe, Button, FiltersSectionComponent],
  templateUrl: './institutions-projects.component.html',
  styleUrl: './institutions-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class InstitutionsProjectsComponent implements OnInit, OnDestroy {
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  private translate = inject(TranslateService);

  private actions = createDispatchMap({
    sendUserMessage: SendUserMessage,
    requestProjectAccess: RequestProjectAccess,
    setDefaultFilterValue: SetDefaultFilterValue,
    resetSearchState: ResetSearchState,
    setSortBy: SetSortBy,
    setResourceType: SetResourceType,
    fetchResources: FetchResources,
    fetchResourcesByLink: FetchResourcesByLink,
  });

  tableColumns = projectTableColumns;
  filtersVisible = signal(false);

  sortField = signal<string>('-dateModified');
  sortOrder = signal<number>(1);

  resources = select(GlobalSearchSelectors.getResources);
  areResourcesLoading = select(GlobalSearchSelectors.getResourcesLoading);
  resourcesCount = select(GlobalSearchSelectors.getResourcesCount);

  selfLink = select(GlobalSearchSelectors.getFirst);
  firstLink = select(GlobalSearchSelectors.getFirst);
  nextLink = select(GlobalSearchSelectors.getNext);
  previousLink = select(GlobalSearchSelectors.getPrevious);

  institution = select(InstitutionsAdminSelectors.getInstitution);
  currentUser = select(UserSelectors.getCurrentUser);

  tableData = computed(() =>
    this.resources().map((resource: ResourceModel): TableCellData => mapProjectResourceToTableCellData(resource))
  );

  sortParam = computed(() => {
    const sortField = this.sortField();
    const sortOrder = this.sortOrder();
    return sortOrder === SortOrder.Desc ? `-${sortField}` : sortField;
  });

  paginationLinks = computed(() => {
    return {
      next: { href: this.nextLink() },
      prev: { href: this.previousLink() },
      first: { href: this.firstLink() },
    };
  });

  ngOnInit(): void {
    this.actions.setResourceType(ResourceType.Project);
    this.actions.setDefaultFilterValue('affiliation', this.institution().iris.join(','));
    this.actions.fetchResources();
  }

  ngOnDestroy() {
    this.actions.resetSearchState();
  }

  onSortChange(params: SearchFilters): void {
    this.sortField.set(params.sortColumn || '-dateModified');
    this.sortOrder.set(params.sortOrder || 1);

    this.actions.setSortBy(this.sortParam());
    this.actions.fetchResources();
  }

  onLinkPageChange(link: string): void {
    this.actions.fetchResourcesByLink(link);
  }

  download(type: DownloadType) {
    downloadResults(this.selfLink(), type);
  }

  onIconClick(event: TableIconClickEvent): void {
    if (event.action !== 'sendMessage') {
      return;
    }

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
}
