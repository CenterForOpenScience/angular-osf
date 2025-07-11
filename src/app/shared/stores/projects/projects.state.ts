import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { ProjectOverviewService } from '@osf/features/project/overview/services';
import { ProjectsService } from '@shared/services/projects.service';
import { GetProjects, ProjectsStateModel, SetSelectedProject, UpdateProjectMetadata } from '@shared/stores';

@State<ProjectsStateModel>({
  name: 'projects',
  defaults: {
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
  },
})
@Injectable()
export class ProjectsState {
  private readonly projectsService = inject(ProjectsService);
  private readonly projectOverviewService = inject(ProjectOverviewService);

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
      catchError((error) => {
        ctx.patchState({
          projects: {
            ...ctx.getState().projects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
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
}
