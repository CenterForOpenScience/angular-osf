import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';

import { filter, forkJoin } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import {
  AddContributor,
  DeleteContributor,
  FetchContributors,
  SubmitPreprintSelectors,
  UpdateContributor,
} from '@osf/features/preprints/store/submit-preprint';
import { EducationHistoryDialogComponent, EmploymentHistoryDialogComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsListComponent,
} from '@osf/shared/components/contributors';
import { AddContributorType } from '@osf/shared/components/contributors/enums';
import { ContributorDialogAddModel, ContributorModel } from '@osf/shared/components/contributors/models';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import { findChangedItems } from '@osf/shared/utils';

@Component({
  selector: 'osf-preprint-contributors',
  imports: [FormsModule, TableModule, ContributorsListComponent, TranslatePipe, Card, Button, Message],
  templateUrl: './contributors.component.html',
  styleUrl: './contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ContributorsComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  readonly translateService = inject(TranslateService);
  readonly dialogService = inject(DialogService);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);

  protected initialContributors = select(SubmitPreprintSelectors.getContributors);
  protected contributors = signal([]);

  protected readonly isContributorsLoading = select(SubmitPreprintSelectors.areContributorsLoading);

  protected actions = createDispatchMap({
    getContributors: FetchContributors,
    deleteContributor: DeleteContributor,
    updateContributor: UpdateContributor,
    addContributor: AddContributor,
  });

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    effect(() => {
      this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
    });
  }

  ngOnInit(): void {
    this.actions.getContributors();
  }

  cancel() {
    this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    const updateRequests = updatedContributors.map((payload) => this.actions.updateContributor(payload));

    forkJoin(updateRequests).subscribe(() => {
      this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
    });
  }

  openEmploymentHistory(contributor: ContributorModel) {
    this.dialogService.open(EmploymentHistoryDialogComponent, {
      width: '552px',
      data: contributor.employment,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.employment'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  openEducationHistory(contributor: ContributorModel) {
    this.dialogService.open(EducationHistoryDialogComponent, {
      width: '552px',
      data: contributor.education,
      focusOnShow: false,
      header: this.translateService.instant('project.contributors.table.headers.education'),
      closeOnEscape: true,
      modal: true,
      closable: true,
    });
  }

  openAddContributorDialog() {
    const addedContributorIds = this.initialContributors().map((x) => x.userId);

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
          const addRequests = res.data.map((payload) => this.actions.addContributor(payload));

          forkJoin(addRequests).subscribe(() => {
            this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
          });
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
          const successMessage = this.translateService.instant('project.contributors.toastMessages.addSuccessMessage');
          const params = { name: res.data[0].fullName };

          this.actions.addContributor(res.data[0]).subscribe({
            next: () => this.toastService.showSuccess(successMessage, params),
          });
        }
      });
  }

  removeContributor(contributor: ContributorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(contributor.userId)
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
}
