import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';

import { catchError, EMPTY, filter } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
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

import { UserSelectors } from '@core/store/user';
import { RequestAccessErrorDialogComponent } from '@osf/features/admin-institutions/components/request-access-error-dialog/request-access-error-dialog.component';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { PaginationLinksModel, ResourceModel, SearchFilters } from '@osf/shared/models';
import { CustomDialogService, ToastService } from '@osf/shared/services';
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
import { FiltersSectionComponent } from '../../components/filters-section/filters-section.component';
import { projectTableColumns } from '../../constants';
import { ContactDialogComponent } from '../../dialogs';
import { ContactOption, DownloadType } from '../../enums';
import { downloadResults } from '../../helpers';
import { mapProjectResourceToTableCellData } from '../../mappers/institution-project-to-table-data.mapper';
import { ContactDialogData, TableCellData, TableCellLink, TableIconClickEvent } from '../../models';
import { InstitutionsAdminSelectors, RequestProjectAccess, SendUserMessage } from '../../store';

@Component({
  selector: 'osf-institutions-projects',
  imports: [AdminTableComponent, TranslatePipe, Button, FiltersSectionComponent],
  templateUrl: './institutions-projects.component.html',
  styleUrl: './institutions-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitutionsProjectsComponent implements OnInit, OnDestroy {
  private customDialogService = inject(CustomDialogService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

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
    this.resources().map(
      (resource: ResourceModel): TableCellData => mapProjectResourceToTableCellData(resource, this.institution().iri)
    )
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
    } as PaginationLinksModel;
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

    this.openContactDialog(event);
  }

  private openContactDialog(event: TableIconClickEvent, defaultData?: ContactDialogData): void {
    this.customDialogService
      .open(ContactDialogComponent, {
        header: 'adminInstitutions.institutionUsers.sendEmail',
        width: '448px',
        data: {
          currentUserFullName: this.currentUser()?.fullName,
          defaultContactData: defaultData,
        },
      })
      .onClose.pipe(
        filter((value) => !!value),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: ContactDialogData) => this.sendEmailToUser(event, data));
  }

  private sendEmailToUser(event: TableIconClickEvent, emailData: ContactDialogData): void {
    const userId = (event.rowData['creator'] as TableCellLink[])[event.arrayIndex ?? 0].url.split('/').pop() || '';

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
      const projectId = (event.rowData['link'] as TableCellLink).url.split('/').pop() || '';

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
        .pipe(
          catchError((e) => {
            if (e instanceof HttpErrorResponse && e.status === 403) {
              this.customDialogService
                .open(RequestAccessErrorDialogComponent, {
                  header: 'adminInstitutions.requestAccessErrorDialog.title',
                })
                .onClose.pipe(
                  filter((value) => !!value),
                  takeUntilDestroyed(this.destroyRef)
                )
                .subscribe(() =>
                  this.openContactDialog(event, { ...emailData, selectedOption: ContactOption.SendMessage })
                );
            }

            return EMPTY;
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => this.toastService.showSuccess('adminInstitutions.institutionUsers.requestSent'));
    }
  }
}
