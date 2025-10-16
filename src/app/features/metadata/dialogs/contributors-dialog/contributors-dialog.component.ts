import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TablePageEvent } from 'primeng/table';

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
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import { SearchInputComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { AddContributorType, ResourceType } from '@osf/shared/enums';
import { findChangedItems } from '@osf/shared/helpers';
import { ContributorDialogAddModel, ContributorModel, TableParameters } from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';
import {
  AddContributor,
  BulkAddContributors,
  BulkUpdateContributors,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  UpdateBibliographyFilter,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
} from '@osf/shared/stores';

import { MetadataSelectors } from '../../store';

@Component({
  selector: 'osf-contributors-dialog',
  imports: [Button, SearchInputComponent, TranslatePipe, FormsModule, ContributorsTableComponent],
  templateUrl: './contributors-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributorsDialogComponent implements OnInit {
  searchControl = new FormControl<string>('');

  readonly destroyRef = inject(DestroyRef);
  readonly customDialogService = inject(CustomDialogService);
  readonly toastService = inject(ToastService);
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly router = inject(Router);

  isLoading = select(ContributorsSelectors.isContributorsLoading);
  initialContributors = select(ContributorsSelectors.getContributors);
  contributorsTotalCount = select(ContributorsSelectors.getContributorsTotalCount);
  hasAdminAccess = select(MetadataSelectors.hasAdminAccess);
  contributors = signal<ContributorModel[]>([]);
  page = select(ContributorsSelectors.getContributorsPageNumber);
  pageSize = select(ContributorsSelectors.getContributorsPageSize);

  currentUser = select(UserSelectors.getCurrentUser);

  readonly tableParams = computed<TableParameters>(() => ({
    ...DEFAULT_TABLE_PARAMS,
    totalRecords: this.contributorsTotalCount(),
    paginator: this.contributorsTotalCount() > DEFAULT_TABLE_PARAMS.rows,
    firstRowIndex: (this.page() - 1) * this.pageSize(),
    rows: this.pageSize(),
  }));

  actions = createDispatchMap({
    getContributors: GetAllContributors,
    updateSearchValue: UpdateContributorsSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    addContributor: AddContributor,
    bulkAddContributors: BulkAddContributors,
    bulkUpdateContributors: BulkUpdateContributors,
  });

  private readonly resourceType: ResourceType;
  private readonly resourceId: string;

  get searchPlaceholder() {
    return this.resourceType === ResourceType.Project
      ? 'project.contributors.searchProjectPlaceholder'
      : 'project.contributors.searchRegistrationPlaceholder';
  }

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    this.resourceId = this.config.data?.resourceId;
    this.resourceType = this.config.data?.resourceType;

    effect(() => {
      this.contributors.set(structuredClone(this.initialContributors()));
    });
  }

  ngOnInit(): void {
    this.setSearchSubscription();
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
  }

  openAddContributorDialog(): void {
    const addedContributorIds = this.initialContributors().map((x) => x.userId);

    this.customDialogService
      .open(AddContributorDialogComponent, {
        header: 'project.contributors.addDialog.addRegisteredContributor',
        width: '448px',
        data: addedContributorIds,
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Unregistered) {
          this.openAddUnregisteredContributorDialog();
        } else {
          if (res?.type === AddContributorType.Registered) {
            this.actions
              .bulkAddContributors(this.resourceId, this.resourceType, res.data)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() =>
                this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage')
              );
          }
        }
      });
  }

  openAddUnregisteredContributorDialog() {
    this.customDialogService
      .open(AddUnregisteredContributorDialogComponent, {
        header: 'project.contributors.addDialog.addUnregisteredContributor',
        width: '448px',
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Registered) {
          this.openAddContributorDialog();
        } else {
          const params = { name: res.data[0].fullName };

          this.actions.addContributor(this.resourceId, this.resourceType, res.data[0]).subscribe({
            next: () => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params),
          });
        }
      });
  }

  removeContributor(contributor: ContributorModel): void {
    const isDeletingSelf = contributor.userId === this.currentUser()?.id;

    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.resourceId, this.resourceType, contributor.userId, isDeletingSelf)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              });

              if (isDeletingSelf) {
                this.dialogRef.close();
                this.router.navigate(['/']);
              }
            },
          });
      },
    });
  }

  pageChanged(event: TablePageEvent) {
    const page = Math.floor(event.first / event.rows) + 1;
    const pageSize = event.rows;

    this.actions.getContributors(this.resourceId, this.resourceType, page, pageSize);
  }

  cancel() {
    this.contributors.set(structuredClone(this.initialContributors()));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    this.actions
      .bulkUpdateContributors(this.resourceId, this.resourceType, updatedContributors)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() =>
        this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage')
      );
  }
}
