import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { EMPTY, filter, switchMap, tap } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';

import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
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
  ResetContributorsState,
} from '@osf/shared/stores/contributors';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';
import { TableParameters } from '@shared/models/table-parameters.model';

@Component({
  selector: 'osf-registries-contributors',
  imports: [ContributorsTableComponent, TranslatePipe, Card, Button],
  templateUrl: './registries-contributors.component.html',
  styleUrl: './registries-contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistriesContributorsComponent implements OnInit, OnDestroy {
  control = input.required<FormControl>();
  draftId = input.required<string>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  initialContributors = select(ContributorsSelectors.getContributors);
  contributors = signal<ContributorModel[]>([]);

  isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  contributorsTotalCount = select(ContributorsSelectors.getContributorsTotalCount);
  isLoadingMore = select(ContributorsSelectors.isContributorsLoadingMore);
  pageSize = select(ContributorsSelectors.getContributorsPageSize);

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
    deleteContributor: DeleteContributor,
    bulkUpdateContributors: BulkUpdateContributors,
    bulkAddContributors: BulkAddContributors,
    loadMoreContributors: LoadMoreContributors,
    resetContributorsState: ResetContributorsState,
  });

  get hasChanges(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.contributors());
  }

  constructor() {
    effect(() => {
      this.contributors.set(structuredClone(this.initialContributors()));
    });
  }

  ngOnInit(): void {
    this.actions.getContributors(this.draftId(), ResourceType.DraftRegistration);
  }

  ngOnDestroy(): void {
    this.actions.resetContributorsState();
  }

  onFocusOut() {
    const control = this.control();
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  }

  cancel() {
    this.contributors.set(structuredClone(this.initialContributors()));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    this.actions
      .bulkUpdateContributors(this.draftId(), ResourceType.DraftRegistration, updatedContributors)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() =>
        this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage')
      );
  }

  openAddContributorDialog() {
    this.customDialogService
      .open(AddContributorDialogComponent, {
        header: 'project.contributors.addDialog.addRegisteredContributor',
        width: '448px',
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        switchMap((res: ContributorDialogAddModel) => {
          if (res.type === AddContributorType.Unregistered) {
            this.openAddUnregisteredContributorDialog();
            return EMPTY;
          }

          return this.actions
            .bulkAddContributors(this.draftId(), ResourceType.DraftRegistration, res.data)
            .pipe(
              tap(() => this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage'))
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  openAddUnregisteredContributorDialog() {
    this.customDialogService
      .open(AddUnregisteredContributorDialogComponent, {
        header: 'project.contributors.addDialog.addUnregisteredContributor',
        width: '448px',
      })
      .onClose.pipe(
        filter((res: ContributorDialogAddModel) => !!res),
        switchMap((res) => {
          if (res.type === AddContributorType.Registered) {
            this.openAddContributorDialog();
            return EMPTY;
          }

          const params = { name: res.data[0].fullName };
          return this.actions
            .bulkAddContributors(this.draftId(), ResourceType.DraftRegistration, res.data)
            .pipe(
              tap(() => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params))
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  removeContributor(contributor: ContributorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.draftId(), ResourceType.DraftRegistration, contributor.userId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              });
            },
          });
      },
    });
  }

  loadMoreContributors(): void {
    this.actions.loadMoreContributors(this.draftId(), ResourceType.DraftRegistration);
  }
}
