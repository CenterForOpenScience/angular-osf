import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Step, StepItem, StepPanel } from 'primeng/stepper';
import { Tooltip } from 'primeng/tooltip';

import { filter } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { UserSelectors } from '@core/store/user';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
import { InfoIconComponent } from '@osf/shared/components/info-icon/info-icon.component';
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
  LoadMoreContributors,
} from '@osf/shared/stores/contributors';
import { ProjectsSelectors } from '@osf/shared/stores/projects';
import { ContributorModel } from '@shared/models/contributors/contributor.model';
import { ContributorDialogAddModel } from '@shared/models/contributors/contributor-dialog-add.model';
import { TableParameters } from '@shared/models/table-parameters.model';

@Component({
  selector: 'osf-project-contributors-step',
  imports: [Button, Step, StepItem, StepPanel, Tooltip, TranslatePipe, ContributorsTableComponent, InfoIconComponent],
  templateUrl: './project-contributors-step.component.html',
  styleUrl: './project-contributors-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectContributorsStepComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly router = inject(Router);

  readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  readonly contributorsTotalCount = select(ContributorsSelectors.getContributorsTotalCount);
  readonly selectedProject = select(ProjectsSelectors.getSelectedProject);
  readonly currentUser = select(UserSelectors.getCurrentUser);
  isLoadingMore = select(ContributorsSelectors.isContributorsLoadingMore);

  private initialContributors = select(ContributorsSelectors.getContributors);
  readonly projectContributors = signal<ContributorModel[]>([]);
  pageSize = select(ContributorsSelectors.getContributorsPageSize);

  readonly tableParams = computed<TableParameters>(() => ({
    ...DEFAULT_TABLE_PARAMS,
    totalRecords: this.contributorsTotalCount(),
    paginator: false,
    scrollable: true,
    firstRowIndex: 0,
    rows: this.pageSize(),
  }));

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  isDisabled = input.required<boolean>();
  isProjectMetadataSaved = input<boolean>(false);
  projectId = input<string | undefined>();

  stepChange = output<number>();
  contributorsSaved = output<void>();

  actions = createDispatchMap({
    addContributor: AddContributor,
    bulkAddContributors: BulkAddContributors,
    bulkUpdateContributors: BulkUpdateContributors,
    deleteContributor: DeleteContributor,
    loadMoreContributors: LoadMoreContributors,
  });

  constructor() {
    this.setupEffects();
  }

  hasContributorsChanged(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.projectContributors());
  }

  handleRemoveContributor(contributor: ContributorModel) {
    const isDeletingSelf = contributor.userId === this.currentUser()?.id;

    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.selectedProject()?.id, ResourceType.Project, contributor.userId, isDeletingSelf)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('project.contributors.removeDialog.successMessage', {
                name: contributor.fullName,
              });

              if (isDeletingSelf) {
                this.router.navigate(['/']);
              }
            },
          });
      },
    });
  }

  handleAddContributor() {
    this.openAddContributorDialog();
  }

  handleSaveContributors() {
    if (this.hasContributorsChanged()) {
      const updatedContributors = findChangedItems(this.initialContributors(), this.projectContributors(), 'id');

      if (!updatedContributors.length) {
        this.projectContributors.set(structuredClone(this.initialContributors()));
        this.contributorsSaved.emit();
      } else {
        this.actions
          .bulkUpdateContributors(this.selectedProject()?.id, ResourceType.Project, updatedContributors)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
            this.contributorsSaved.emit();
          });
      }
    } else {
      this.contributorsSaved.emit();
    }
  }

  handleEditStep() {
    this.stepChange.emit(this.targetStepValue());
  }

  loadMoreContributors(): void {
    this.actions.loadMoreContributors(this.projectId(), ResourceType.Project);
  }

  private openAddContributorDialog() {
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
            .bulkAddContributors(this.selectedProject()?.id, ResourceType.Project, res.data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() =>
              this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage')
            );
        }
      });
  }

  private openAddUnregisteredContributorDialog() {
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

          this.actions.addContributor(this.selectedProject()?.id, ResourceType.Project, res.data[0]).subscribe({
            next: () => this.toastService.showSuccess('project.contributors.toastMessages.addSuccessMessage', params),
          });
        }
      });
  }

  private setupEffects(): void {
    effect(() => {
      const isMetadataSaved = this.isProjectMetadataSaved();
      const contributors = this.initialContributors();

      if (isMetadataSaved && contributors.length) {
        this.projectContributors.set(structuredClone(contributors));
      }
    });
  }
}
