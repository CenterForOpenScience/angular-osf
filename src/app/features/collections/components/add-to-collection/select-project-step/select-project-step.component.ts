import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Select, SelectChangeEvent, SelectFilterEvent } from 'primeng/select';
import { Step, StepItem, StepPanel } from 'primeng/stepper';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
import { FormsModule } from '@angular/forms';

import { UserSelectors } from '@core/store/user';
import { AddToCollectionSteps } from '@osf/features/collections/enums';
import { GetProjects, SetSelectedProject } from '@osf/shared/stores';
import { CustomOption } from '@shared/models';
import { Project } from '@shared/models/projects';
import { CollectionsSelectors, GetUserCollectionSubmissions } from '@shared/stores/collections';
import { ProjectsSelectors } from '@shared/stores/projects/projects.selectors';

@Component({
  selector: 'osf-select-project-step',
  imports: [Button, TranslatePipe, Select, FormsModule, Step, StepItem, StepPanel],
  templateUrl: './select-project-step.component.html',
  styleUrl: './select-project-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectProjectStepComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();
  private readonly filterSubject = new Subject<string>();

  protected projects = select(ProjectsSelectors.getProjects);
  protected isProjectsLoading = select(ProjectsSelectors.getProjectsLoading);
  protected selectedProject = select(ProjectsSelectors.getSelectedProject);
  protected currentUser = select(UserSelectors.getCurrentUser);
  protected currentUserSubmissions = select(CollectionsSelectors.getUserCollectionSubmissions);
  protected isSubmissionsLoading = select(CollectionsSelectors.getUserCollectionSubmissionsLoading);

  stepperActiveValue = input.required<number>();
  targetStepValue = input.required<number>();
  collectionId = input.required<string>();

  stepChange = output<number>();
  projectSelected = output<void>();

  protected projectsOptions = signal<CustomOption<Project>[]>([]);

  protected filterMessage = computed(() => {
    const isLoading = this.isProjectsLoading() || this.isSubmissionsLoading();
    return isLoading
      ? this.translateService.instant('collections.addToCollection.form.loadingPlaceholder')
      : this.translateService.instant('collections.addToCollection.form.noProjectsFound');
  });

  protected actions = createDispatchMap({
    getProjects: GetProjects,
    setSelectedProject: SetSelectedProject,
    getUserCollectionSubmissions: GetUserCollectionSubmissions,
  });

  constructor() {
    this.setupEffects();
    this.setupFilterDebounce();
  }

  handleProjectChange(event: SelectChangeEvent) {
    const project = event.value;
    if (project) {
      this.actions.setSelectedProject(project);
      this.projectSelected.emit();
      this.stepChange.emit(AddToCollectionSteps.ProjectMetadata);
    }
  }

  handleFilterSearch(event: SelectFilterEvent) {
    event.originalEvent.preventDefault();
    this.filterSubject.next(event.filter);
  }

  handleEditStep() {
    this.stepChange.emit(this.targetStepValue());
  }

  private setupEffects(): void {
    effect(() => {
      const currentUser = this.currentUser();
      if (currentUser) {
        this.actions.getProjects(currentUser.id);
      }
    });

    effect(() => {
      const projects = this.projects();
      const collectionId = this.collectionId();
      const isProjectsLoading = this.isProjectsLoading();

      if (projects.length && collectionId && !isProjectsLoading) {
        const projectIds = projects.map((project) => project.id);
        this.actions.getUserCollectionSubmissions(collectionId, projectIds);
      }
    });

    effect(() => {
      const isProjectsLoading = this.isProjectsLoading();
      const isSubmissionsLoading = this.isSubmissionsLoading();
      const projects = this.projects();
      const submissions = this.currentUserSubmissions();

      if (isProjectsLoading || isSubmissionsLoading || !projects.length) {
        this.projectsOptions.set([]);
      }

      if (!isProjectsLoading && !isSubmissionsLoading && projects.length) {
        const submissionProjectIds = new Set(submissions.map((submission) => submission.nodeId));
        const availableProjects = projects.filter((project) => !submissionProjectIds.has(project.id));

        const options = availableProjects.map((project) => ({
          label: project.title,
          value: project,
        }));

        this.projectsOptions.set(options);
      }
    });

    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.destroy$.next();
        this.destroy$.complete();
      });
    });
  }

  private setupFilterDebounce(): void {
    this.filterSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        const currentUser = this.currentUser();
        if (!currentUser) return;

        const params: Record<string, string> = {
          'filter[current_user_permissions]': 'admin',
          'filter[title]': filterValue,
        };

        this.actions.getProjects(currentUser.id, params);
      });
  }
}
