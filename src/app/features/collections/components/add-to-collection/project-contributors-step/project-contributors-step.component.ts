import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { Step, StepItem, StepPanel } from 'primeng/stepper';
import { Tooltip } from 'primeng/tooltip';

import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  AddContributorDialogComponent,
  AddUnregisteredContributorDialogComponent,
  ContributorsListComponent,
} from '@shared/components/contributors';
import { AddContributorType, ResourceType } from '@shared/enums';
import { ContributorDialogAddModel, ContributorModel } from '@shared/models';
import { CustomConfirmationService, ToastService } from '@shared/services';
import { AddContributor, ContributorsSelectors, DeleteContributor, UpdateContributor } from '@shared/stores';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';
import { findChangedItems } from '@shared/utils';

@Component({
  selector: 'osf-project-contributors-step',
  imports: [Button, TranslatePipe, ContributorsListComponent, Step, StepItem, StepPanel, Tooltip],
  templateUrl: './project-contributors-step.component.html',
  styleUrl: './project-contributors-step.component.scss',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectContributorsStepComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);
  private readonly toastService = inject(ToastService);
  private readonly customConfirmationService = inject(CustomConfirmationService);

  protected readonly projectContributors = select(ContributorsSelectors.getContributors);
  protected readonly isContributorsLoading = select(ContributorsSelectors.isContributorsLoading);
  protected readonly isContributorsSubmitting = select(ContributorsSelectors.isContributorsSubmitting);
  protected readonly selectedProject = select(ProjectsSelectors.getSelectedProject);

  private initialContributors = signal<ContributorModel[]>([]);

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  isDisabled = input.required<boolean>();
  isProjectMetadataSaved = input<boolean>(false);

  stepChange = output<number>();
  contributorsSaved = output<void>();

  protected actions = createDispatchMap({
    addContributor: AddContributor,
    updateContributor: UpdateContributor,
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
        this.initialContributors.set(JSON.parse(JSON.stringify(this.projectContributors())));
        this.contributorsSaved.emit();
      } else {
        const updateRequests = updatedContributors.map((payload) =>
          this.actions.updateContributor(this.selectedProject()?.id, ResourceType.Project, payload)
        );
        forkJoin(updateRequests).subscribe(() => {
          this.toastService.showSuccess('project.contributors.toastMessages.multipleUpdateSuccessMessage');
          this.initialContributors.set(JSON.parse(JSON.stringify(this.projectContributors())));
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
          const addRequests = res.data.map((payload) =>
            this.actions.addContributor(this.selectedProject()?.id, ResourceType.Project, payload)
          );

          forkJoin(addRequests).subscribe(() => {
            this.toastService.showSuccess('project.contributors.toastMessages.multipleAddSuccessMessage');
          });
        }
      });
  }

  private openAddUnregisteredContributorDialog() {
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

          this.actions.addContributor(this.selectedProject()?.id, ResourceType.Project, res.data[0]).subscribe({
            next: () => this.toastService.showSuccess(successMessage, params),
          });
        }
      });
  }

  private setupEffects(): void {
    effect(() => {
      const isMetadataSaved = this.isProjectMetadataSaved();
      const contributors = this.projectContributors();

      if (isMetadataSaved && contributors.length && !this.initialContributors().length) {
        this.initialContributors.set(JSON.parse(JSON.stringify(contributors)));
      }
    });
  }
}
