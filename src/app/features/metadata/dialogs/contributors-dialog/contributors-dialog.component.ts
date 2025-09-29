import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { filter, forkJoin } from 'rxjs';

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

import { UserSelectors } from '@core/store/user';
import { SearchInputComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
import { AddContributorType, ContributorPermission, ResourceType } from '@osf/shared/enums';
import { findChangedItems } from '@osf/shared/helpers';
import { ContributorDialogAddModel, ContributorModel } from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';
import {
  AddContributor,
  ContributorsSelectors,
  DeleteContributor,
  UpdateBibliographyFilter,
  UpdateContributor,
  UpdateContributorsSearchValue,
  UpdatePermissionFilter,
} from '@osf/shared/stores';

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

  isLoading = select(ContributorsSelectors.isContributorsLoading);
  initialContributors = select(ContributorsSelectors.getContributors);
  contributors = signal([]);

  currentUser = select(UserSelectors.getCurrentUser);

  actions = createDispatchMap({
    updateSearchValue: UpdateContributorsSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    addContributor: AddContributor,
    updateContributor: UpdateContributor,
  });

  private readonly resourceType: ResourceType;
  private readonly resourceId: string;

  isCurrentUserAdminContributor = computed(() => {
    const currentUserId = this.currentUser()?.id;
    const initialContributors = this.initialContributors();
    if (!currentUserId) return false;

    return initialContributors.some(
      (contributor: ContributorModel) =>
        contributor.userId === currentUserId && contributor.permission === ContributorPermission.Admin
    );
  });

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
      this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
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
            const addRequests = res.data.map((payload) =>
              this.actions.addContributor(this.resourceId, this.resourceType, payload)
            );

            forkJoin(addRequests).subscribe(() =>
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
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.resourceId, this.resourceType, contributor.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () =>
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              }),
          });
      },
    });
  }

  cancel() {
    this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    const updateRequests = updatedContributors.map((payload) =>
      this.actions.updateContributor(this.resourceId, this.resourceType, payload)
    );

    forkJoin(updateRequests).subscribe(() => {
      this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
    });
  }
}
