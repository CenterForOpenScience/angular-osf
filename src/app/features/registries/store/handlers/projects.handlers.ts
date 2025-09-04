import { StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { ProjectsService } from '@osf/shared/services/projects.service';

import { Project } from '../../models';
import { DefaultState } from '../default.state';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class ProjectsHandlers {
  projectsService = inject(ProjectsService);

  getProjects({ patchState }: StateContext<RegistriesStateModel>) {
    const params: Record<string, unknown> = {
      'filter[current_user_permissions]': 'admin',
    };

    patchState({
      projects: {
        ...DefaultState.projects,
        isLoading: true,
      },
    });
    // [NM] TODO: check if need to change 'me' to user id
    return this.projectsService.fetchProjects('me', params).subscribe({
      next: (projects: Project[]) => {
        patchState({
          projects: {
            data: projects,
            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        patchState({
          projects: { ...DefaultState.projects, isLoading: false, error },
        });
      },
    });
  }

  fetchProjectChildren(ctx: StateContext<RegistriesStateModel>, projectId: string) {
    const state = ctx.getState();
    ctx.patchState({
      draftRegistration: {
        data: state.draftRegistration.data,
        isLoading: true,
        error: null,
      },
    });

    return this.projectsService.getComponentsTree(projectId).subscribe({
      next: (children: Project[]) => {
        ctx.patchState({
          draftRegistration: {
            data: {
              ...state.draftRegistration.data!,
              components: [...state.draftRegistration.data!.components, ...children],
            },
            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        ctx.patchState({
          projects: { ...state.projects, isLoading: false, error },
        });
      },
    });
  }
}
