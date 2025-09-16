import { StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { ProjectsService } from '@osf/shared/services/projects.service';

import { ProjectShortInfoModel } from '../../models';
import { REGISTRIES_STATE_DEFAULTS, RegistriesStateModel } from '../registries.model';

@Injectable()
export class ProjectsHandlers {
  projectsService = inject(ProjectsService);

  getProjects(ctx: StateContext<RegistriesStateModel>, userId: string, search: string) {
    const params: Record<string, unknown> = {
      'filter[current_user_permissions]': 'admin',
    };

    if (search) {
      params['filter[title]'] = search;
    }
    const state = ctx.getState();
    ctx.patchState({
      projects: {
        data: state.projects.data,
        error: null,
        isLoading: true,
      },
    });
    return this.projectsService.fetchProjects(userId, params).subscribe({
      next: (projects: ProjectShortInfoModel[]) => {
        ctx.patchState({
          projects: {
            data: projects,
            isLoading: false,
            error: null,
          },
        });
      },
      error: (error) => {
        ctx.patchState({
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
      next: (children: ProjectShortInfoModel[]) => {
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
      error: (error) => handleSectionError(ctx, 'draftRegistration', error),
    });
  }
}
