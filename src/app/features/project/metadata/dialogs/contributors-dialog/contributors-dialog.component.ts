import { createDispatchMap } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Skeleton } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';

import { forkJoin } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule } from '@angular/forms';

import { AddContributorType } from '@osf/features/project/contributors/enums';
import { ContributorDialogAddModel, ContributorModel } from '@osf/features/project/contributors/models';
import {
  AddContributor,
  DeleteContributor,
  UpdateBibliographyFilter,
  UpdatePermissionFilter,
  UpdateSearchValue,
} from '@osf/features/project/contributors/store';
import { SearchInputComponent } from '@osf/shared/components';
import { ToastService } from '@osf/shared/services';

@Component({
  selector: 'osf-contributors-dialog',
  standalone: true,
  imports: [Button, SearchInputComponent, Skeleton, Tooltip, TranslatePipe, FormsModule],
  templateUrl: './contributors-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ContributorsDialogComponent implements OnInit {
  protected searchControl = new FormControl<string>('');

  readonly destroyRef = inject(DestroyRef);
  readonly translateService = inject(TranslateService);
  readonly toastService = inject(ToastService);
  readonly dialogRef = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly dialogService = inject(DialogService);

  protected contributors = signal<ContributorModel[]>([]);
  protected isContributorsLoading = signal<boolean>(false);

  protected actions = createDispatchMap({
    updateSearchValue: UpdateSearchValue,
    updatePermissionFilter: UpdatePermissionFilter,
    updateBibliographyFilter: UpdateBibliographyFilter,
    deleteContributor: DeleteContributor,
    addContributor: AddContributor,
  });

  private readonly projectId: string;

  constructor() {
    this.projectId = this.config.data?.projectId;

    this.contributors.set(this.config.data?.contributors || []);
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
    import(
      '@osf/features/project/contributors/components/add-contributor-dialog/add-contributor-dialog.component'
    ).then(({ AddContributorDialogComponent }) => {
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
        .onClose.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res: ContributorDialogAddModel) => {
          if (res?.type === AddContributorType.Registered) {
            const addRequests = res.data.map((payload) => this.actions.addContributor(this.projectId, payload));

            forkJoin(addRequests).subscribe(() => {
              this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
              this.dialogRef.close({ refresh: true });
            });
          }
        });
    });
  }

  removeContributor(contributor: ContributorModel): void {
    this.actions
      .deleteContributor(this.projectId, contributor.userId)
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
