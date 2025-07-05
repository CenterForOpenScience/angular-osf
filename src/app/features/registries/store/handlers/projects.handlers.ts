import { StateContext } from '@ngxs/store';

import { inject, Injectable } from '@angular/core';

import { Project } from '../../models';
import { ProjectsService } from '../../services';
import { DefaultState } from '../default.state';
import { RegistriesStateModel } from '../registries.model';

@Injectable()
export class ProjectsHandlers {
  projectsService = inject(ProjectsService);

  getProjects({ patchState }: StateContext<RegistriesStateModel>) {
    patchState({
      projects: {
        ...DefaultState.projects,
        isLoading: true,
      },
    });
    return this.projectsService.getProjects().subscribe({
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
}
