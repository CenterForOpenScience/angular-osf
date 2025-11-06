import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';

import { filter } from 'rxjs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

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
  AddContributor,
  BulkAddContributors,
  BulkUpdateContributors,
  ContributorsSelectors,
  DeleteContributor,
  GetAllContributors,
  LoadMoreContributors,
} from '@osf/shared/stores/contributors';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';
import { TableParameters } from '@shared/models/table-parameters.model';

@Component({
  selector: 'osf-preprints-contributors',
  imports: [FormsModule, TableModule, ContributorsTableComponent, TranslatePipe, Card, Button, Message],
  templateUrl: './preprints-contributors.component.html',
  styleUrl: './preprints-contributors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreprintsContributorsComponent implements OnInit {
  preprintId = input<string | undefined>('');

  readonly destroyRef = inject(DestroyRef);
  readonly customDialogService = inject(CustomDialogService);
  readonly toastService = inject(ToastService);
  readonly customConfirmationService = inject(CustomConfirmationService);

  initialContributors = select(ContributorsSelectors.getContributors);
  contributors = signal<ContributorModel[]>([]);
  contributorsTotalCount = select(ContributorsSelectors.getContributorsTotalCount);
  isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
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
    addContributor: AddContributor,
    loadMoreContributors: LoadMoreContributors,
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
    this.actions.getContributors(this.preprintId(), ResourceType.Preprint);
  }

  cancel() {
    this.contributors.set(structuredClone(this.initialContributors()));
  }

  save() {
    const updatedContributors = findChangedItems(this.initialContributors(), this.contributors(), 'id');

    this.actions
      .bulkUpdateContributors(this.preprintId(), ResourceType.Preprint, updatedContributors)
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
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res: ContributorDialogAddModel) => {
        if (res.type === AddContributorType.Unregistered) {
          this.openAddUnregisteredContributorDialog();
        } else {
          this.actions
            .bulkAddContributors(this.preprintId(), ResourceType.Preprint, res.data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage')
            );
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

          this.actions.addContributor(this.preprintId(), ResourceType.Preprint, res.data[0]).subscribe({
            next: () => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params),
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
          .deleteContributor(this.preprintId(), ResourceType.Preprint, contributor.userId)
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
    this.actions.loadMoreContributors(this.preprintId(), ResourceType.Preprint);
  }
}
