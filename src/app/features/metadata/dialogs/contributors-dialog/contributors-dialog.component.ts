import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { AddContributorType } from '@osf/shared/enums/contributors/add-contributor-type.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { findChangedItems } from '@osf/shared/helpers/find-changed-items.helper';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  BulkAddContributors,
  BulkUpdateContributors,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  LoadMoreContributors,
  UpdateBibliographyFilter,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
} from '@osf/shared/stores/contributors';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';
import { TableParameters } from '@shared/models/table-parameters.model';

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
  isLoadingMore = select(ContributorsSelectors.isContributorsLoadingMore);
  pageSize = select(ContributorsSelectors.getContributorsPageSize);
  changesMade = signal<boolean>(false);

  currentUser = select(UserSelectors.getCurrentUser);

  readonly tableParams = computed<TableParameters>(() => ({
    ...DEFAULT_TABLE_PARAMS,
    totalRecords: this.contributorsTotalCount(),
    paginator: false,
    scrollable: true,
    firstRowIndex: 0,
    rows: this.pageSize(),
  }));

  actions = createDispatchMap({
    getContributors: GetAllContributors,
    updateSearchValue: UpdateContributorsSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    bulkAddContributors: BulkAddContributors,
    bulkUpdateContributors: BulkUpdateContributors,
    loadMoreContributors: LoadMoreContributors,
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
    this.actions.getContributors(this.resourceId, this.resourceType);
    this.setSearchSubscription();
  }

  private setSearchSubscription() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.actions.updateSearchValue(res ?? null));
  }

  openAddContributorDialog(): void {
    this.customDialogService
      .open(AddContributorDialogComponent, {
        header: 'project.contributors.addDialog.addRegisteredContributor',
        width: '448px',
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
              .subscribe(() => {
                this.changesMade.set(true);
                this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
              });
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

          this.actions.bulkAddContributors(this.resourceId, this.resourceType, res.data).subscribe({
            next: () => {
              this.changesMade.set(true);
              this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params);
            },
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
              this.changesMade.set(true);
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              });

              if (isDeletingSelf) {
                this.dialogRef.close(this.changesMade());
                this.router.navigate(['/']);
              }
            },
          });
      },
    });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreContributors(this.resourceId, this.resourceType);
  }

  cancel() {
    this.contributors.set(structuredClone(this.initialContributors()));
  }

  onClose(): void {
    this.dialogRef.close(this.changesMade());
  }

  onSave(): void {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    this.actions
      .bulkUpdateContributors(this.resourceId, this.resourceType, updatedContributors)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.changesMade.set(true);
        this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
      });
  }
}
