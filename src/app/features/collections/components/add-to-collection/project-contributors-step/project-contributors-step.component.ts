import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Step, StepItem, StepPanel } from 'primeng/stepper';
import { Tooltip } from 'primeng/tooltip';

import { filter } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InfoIconComponent } from '@osf/shared/components';
import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsTableComponent,
} from '@osf/shared/components/contributors';
import { AddContributorType, ResourceType } from '@osf/shared/enums';
import { findChangedItems } from '@osf/shared/helpers';
import { ContributorDialogAddModel, ContributorModel } from '@osf/shared/models';
import { CustomConfirmationService, CustomDialogService, ToastService } from '@osf/shared/services';
import {
  AddContributor,
  BulkAddContributors,
  BulkUpdateContributors,
  ContributorsSelectors,
  DeleteContributor,
  ProjectsSelectors,
} from '@osf/shared/stores';

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

  readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  readonly selectedProject = select(ProjectsSelectors.getSelectedProject);

  private initialContributors = select(ContributorsSelectors.getContributors);
  readonly projectContributors = signal<ContributorModel[]>([]);

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  isDisabled = input.required<boolean>();
  isProjectMetadataSaved = input<boolean>(false);

  stepChange = output<number>();
  contributorsSaved = output<void>();

  actions = createDispatchMap({
    addContributor: AddContributor,
    bulkAddContributors: BulkAddContributors,
    bulkUpdateContributors: BulkUpdateContributors,
    deleteContributor: DeleteContributor,
  });

  constructor() {
    this.setupEffects();
  }

  hasContributorsChanged(): boolean {
    return JSON.stringify(this.initialContributors()) !== JSON.stringify(this.projectContributors());
  }

  handleRemoveContributor(contributor: ContributorModel) {
    this.customConfirmationService.confirmDelete({
      headerKey: 'project.contributors.removeDialog.title',
      messageKey: 'project.contributors.removeDialog.message',
      messageParams: { name: contributor.fullName },
      acceptLabelKey: 'common.buttons.remove',
      onConfirm: () => {
        this.actions
          .deleteContributor(this.selectedProject()?.id, ResourceType.Project, contributor.userId)
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

  handleAddContributor() {
    this.openAddContributorDialog();
  }

  handleSaveContributors() {
    if (this.hasContributorsChanged()) {
      const updatedContributors = findChangedItems(this.initialContributors(), this.projectContributors(), 'id');

      if (!updatedContributors.length) {
        this.projectContributors.set(JSON.parse(JSON.stringify(this.initialContributors())));
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

  private openAddContributorDialog() {
    const addedContributorIds = this.projectContributors().map((x) => x.userId);

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
        this.projectContributors.set(JSON.parse(JSON.stringify(contributors)));
      }
    });
  }
}
