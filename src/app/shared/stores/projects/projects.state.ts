import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { ProjectsService } from '@shared/services/projects.service';

import { ClearProjects, GetProjects, SetSelectedProject, UpdateProjectMetadata } from './projects.actions';
import { ProjectsStateModel } from './projects.model';

const PROJECTS_DEFAULTS: ProjectsStateModel = {
  projects: {
    data: [],
    isLoading: false,
    error: null,
  },
  selectedProject: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};

@State<ProjectsStateModel>({
  name: 'projects',
  defaults: PROJECTS_DEFAULTS,
})
@Injectable()
export class ProjectsState {
  private readonly projectsService = inject(ProjectsService);

  @Action(GetProjects)
  getProjects(ctx: StateContext<ProjectsStateModel>, action: GetProjects) {
    const state = ctx.getState();

    ctx.patchState({
      projects: {
        ...state.projects,
        isLoading: true,
      },
    });

    return this.projectsService.fetchProjects(action.userId, action.params).pipe(
      tap({
        next: (projects) => {
          ctx.patchState({
            projects: {
              data: projects,
              error: null,
              isLoading: false,
            },
          });
        },
      }),
      catchError((error) => handleSectionError(ctx, 'projects', error))
    );
  }

  @Action(SetSelectedProject)
  setSelectedProject(ctx: StateContext<ProjectsStateModel>, action: SetSelectedProject) {
    const state = ctx.getState();
    ctx.patchState({
      selectedProject: {
        ...state.selectedProject,
        data: action.project,
      },
    });
  }

  @Action(UpdateProjectMetadata)
  updateProjectMetadata(ctx: StateContext<ProjectsStateModel>, action: UpdateProjectMetadata) {
    const state = ctx.getState();
    ctx.patchState({
      selectedProject: {
        ...state.selectedProject,
        isSubmitting: true,
      },
    });

    return this.projectsService.updateProjectMetadata(action.metadata).pipe(
      tap((project) => {
        ctx.patchState({
          selectedProject: {
            ...state.selectedProject,
            data: project,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'selectedProject', error))
    );
  }

  @Action(ClearProjects)
  clearProjects(ctx: StateContext<ProjectsStateModel>) {
    ctx.patchState(PROJECTS_DEFAULTS);
  }
}
