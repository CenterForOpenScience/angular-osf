import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProjectsService } from '@shared/services/projects.service';
import { GetProjects, ProjectsModel } from '@shared/stores';

@State<ProjectsModel>({
  name: 'projects',
  defaults: {
    projects: {
      data: [],
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class ProjectsState {
  private readonly projectsService = inject(ProjectsService);

  @Action(GetProjects)
  getProjects(ctx: StateContext<ProjectsModel>, action: GetProjects) {
    const state = ctx.getState();

    ctx.patchState({
      projects: {
        ...state.projects,
        isLoading: true,
      },
    });

    return this.projectsService.getProjects(action.userId, action.params).pipe(
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
}
