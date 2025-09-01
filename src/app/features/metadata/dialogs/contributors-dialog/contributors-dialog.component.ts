import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { filter, forkJoin } from 'rxjs';

import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { SearchInputComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
} from '@osf/shared/components/contributors';
import { AddContributorType, ResourceType } from '@osf/shared/enums';
import { ContributorDialogAddModel, ContributorModel } from '@osf/shared/models';
import { ToastService } from '@osf/shared/services';
import {
  AddContributor,
  ContributorsSelectors,
  DeleteContributor,
  UpdateBibliographyFilter,
  UpdatePermissionFilter,
  UpdateSearchValue,
} from '@osf/shared/stores';

@Component({
  selector: 'osf-contributors-dialog',
  imports: [Button, SearchInputComponent, Skeleton, Tooltip, TranslatePipe, TitleCasePipe, FormsModule],
  templateUrl: './contributors-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ContributorsDialogComponent implements OnInit {
  searchControl = new FormControl<string>('');

  readonly destroyRef = inject(DestroyRef);
  readonly translateService = inject(TranslateService);
  readonly toastService = inject(ToastService);
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly dialogService = inject(DialogService);
  isContributorsLoading = signal<boolean>(false);
  contributors = select(ContributorsSelectors.getContributors);
  actions = createDispatchMap({
    updateSearchValue: UpdateSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    addContributor: AddContributor,
  });

  private readonly resourceType: ResourceType;
  private readonly resourceId: string;

  constructor() {
    this.resourceId = this.config.data?.resourceId;

    this.resourceType = this.config.data?.resourceType;

    this.isContributorsLoading.set(this.config.data?.isLoading || false);
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
    const addedContributorIds = this.contributors().map((x) => x.userId);

    this.dialogService
      .open(AddContributorDialogComponent, {
        width: '448px',
        data: addedContributorIds,
        focusOnShow: false,
        header: this.translateService.instant('project.contributors.addDialog.addRegisteredContributor'),
        closeOnEscape: true,
        modal: true,
        closable: true,
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

            forkJoin(addRequests).subscribe(() => {
              this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
              this.dialogRef.close({ refresh: true });
            });
          }
        }
      });
  }

  openAddUnregisteredContributorDialog() {
    this.dialogService
      .open(AddUnregisteredContributorDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('project.contributors.addDialog.addUnregisteredContributor'),
        closeOnEscape: true,
        modal: true,
        closable: true,
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
    this.actions
      .deleteContributor(this.resourceId, this.resourceType, contributor.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
            name: contributor.fullName,
          });
          this.dialogRef.close({ refresh: true });
        },
      });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({ saved: true });
  }
}
