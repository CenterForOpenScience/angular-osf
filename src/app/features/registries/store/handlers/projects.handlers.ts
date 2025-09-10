import { StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { ProjectsService } from '@osf/shared/services/projects.service';

import { Project } from '../../models';
import { REGISTRIES_STATE_DEFAULTS, RegistriesStateModel } from '../registries.model';

@Injectable()
export class ProjectsHandlers {
  projectsService = inject(ProjectsService);

  getProjects({ patchState }: StateContext<RegistriesStateModel>, userId: string) {
    // [NM] TODO: move this parameter to projects.service
    const params: Record<string, unknown> = {
      'filter[current_user_permissions]': 'admin',
    };

    patchState({
      projects: {
        ...REGISTRIES_STATE_DEFAULTS.projects,
        isLoading: true,
      },
    });
    return this.projectsService.fetchProjects(userId, params).subscribe({
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
          projects: { ...REGISTRIES_STATE_DEFAULTS.projects, isLoading: false, error },
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
