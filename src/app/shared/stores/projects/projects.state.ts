import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProjectsService } from '@shared/services/projects.service';
import { GetAdminProjects, ProjectsModel } from '@shared/stores';

@State<ProjectsModel>({
  name: 'projects',
  defaults: {
    adminProjects: {
      data: null,
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class ProjectsState {
  private readonly projectsService = inject(ProjectsService);

  @Action(GetAdminProjects)
  getAdminProjects(ctx: StateContext<ProjectsModel>, action: GetAdminProjects) {
    ctx.patchState({
      adminProjects: {
        data: null,
        isLoading: true,
        error: null,
      },
    });

    return this.projectsService.getAdminProjects(action.userId).pipe(
      tap({
        next: (projects) => {
          ctx.patchState({
            adminProjects: {
              data: projects,
              error: null,
              isLoading: false,
            },
          });
        },
      }),
      catchError((error) => {
        ctx.patchState({
          adminProjects: {
            ...ctx.getState().adminProjects,
            isLoading: false,
            error,
          },
        });
        return throwError(() => error);
      })
    );
  }
}
