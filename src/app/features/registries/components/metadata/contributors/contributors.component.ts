import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { filter, forkJoin, map, of } from 'rxjs';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  AddContributor,
  DeleteContributor,
  FetchContributors,
  RegistriesSelectors,
  UpdateContributor,
} from '@osf/features/registries/store';
import { EducationHistoryDialogComponent, EmploymentHistoryDialogComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsListComponent,
} from '@osf/shared/components/contributors';
import { BIBLIOGRAPHY_OPTIONS, PERMISSION_OPTIONS } from '@osf/shared/components/contributors/constants';
import { AddContributorType, ContributorPermission } from '@osf/shared/components/contributors/enums';
import { ContributorDialogAddModel, ContributorModel } from '@osf/shared/components/contributors/models';
import { ContributorsSelectors } from '@osf/shared/components/contributors/store';
import { SelectOption } from '@osf/shared/models';
import { CustomConfirmationService, ToastService } from '@osf/shared/services';
import { findChangedItems } from '@osf/shared/utils';

@Component({
  selector: 'osf-contributors',
  imports: [FormsModule, TableModule, ContributorsListComponent, TranslatePipe, Card, Button],
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

  private readonly route = inject(ActivatedRoute);
  private readonly draftId = toSignal(this.route.params.pipe(map((params) => params['id'])) ?? of(undefined));

  protected readonly selectedPermission = signal<ContributorPermission | null>(null);
  protected readonly selectedBibliography = signal<boolean | null>(null);
  protected readonly permissionsOptions: SelectOption[] = PERMISSION_OPTIONS;
  protected readonly bibliographyOptions: SelectOption[] = BIBLIOGRAPHY_OPTIONS;

  protected initialContributors = select(RegistriesSelectors.getContributors);
  protected contributors = signal([]);

  protected readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);

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
    const draftId = this.draftId();
    if (draftId) {
      this.actions.getContributors(draftId);
    }
  }

  onFocusOut() {
    // [NM] TODO: make request to update contributor if changed
    console.log('Focus out event:', 'Changed:', this.hasChanges);
  }

  cancel() {
    this.contributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    const updateRequests = updatedContributors.map((payload) =>
      this.actions.updateContributor(this.draftId(), payload)
    );

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
          const addRequests = res.data.map((payload) => this.actions.addContributor(this.draftId(), payload));

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

          this.actions.addContributor(this.draftId(), res.data[0]).subscribe({
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
          .deleteContributor(this.draftId(), contributor.userId)
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
