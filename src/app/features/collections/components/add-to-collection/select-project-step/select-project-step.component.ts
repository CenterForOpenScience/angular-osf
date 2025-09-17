import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { SetSelectedProject } from '@osf/shared/stores';
import { ProjectSelectorComponent } from '@shared/components';
import { ProjectModel } from '@shared/models/projects';
import { CollectionsSelectors, GetUserCollectionSubmissions } from '@shared/stores/collections';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

@Component({
  selector: 'osf-select-project-step',
  imports: [Button, TranslatePipe, ProjectSelectorComponent, Step, StepItem, StepPanel],
  templateUrl: './select-project-step.component.html',
  styleUrl: './select-project-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectProjectStepComponent {
  selectedProject = select(ProjectsSelectors.getSelectedProject);
  currentUserSubmissions = select(CollectionsSelectors.getUserCollectionSubmissions);

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  collectionId = input.required<string>();

  stepChange = output<number>();
  projectSelected = output<void>();

  currentSelectedProject = signal<ProjectModel | null>(null);

  excludedProjectIds = computed(() => {
    const submissions = this.currentUserSubmissions();
    return submissions.map((submission) => submission.nodeId);
  });

  actions = createDispatchMap({
    setSelectedProject: SetSelectedProject,
    getUserCollectionSubmissions: GetUserCollectionSubmissions,
  });

  handleProjectChange(project: ProjectModel | null): void {
    if (project) {
      this.currentSelectedProject.set(project);
      this.actions.setSelectedProject(project);
      this.projectSelected.emit();
      this.stepChange.emit(AddToCollectionSteps.ProjectMetadata);
    }
  }

  handleProjectsLoaded(projects: ProjectModel[]): void {
    const collectionId = this.collectionId();
    if (collectionId && projects.length) {
      const projectIds = projects.map((project) => project.id);
      this.actions.getUserCollectionSubmissions(collectionId, projectIds);
    }
  }

  handleEditStep() {
    this.stepChange.emit(this.targetStepValue());
  }
}
