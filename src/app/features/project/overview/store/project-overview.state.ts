import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@shared/enums';

import { ProjectOverviewService } from '../services';

import {
  ClearProjectOverview,
  CreateComponent,
  DeleteComponent,
  DuplicateProject,
  ForkResource,
  GetComponents,
  GetProjectById,
  SetProjectCustomCitation,
  UpdateProjectPublicStatus,
} from './project-overview.actions';
import { ProjectOverviewStateModel } from './project-overview.model';

const PROJECT_OVERVIEW_DEFAULTS: ProjectOverviewStateModel = {
  project: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  components: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};

@State<ProjectOverviewStateModel>({
  name: 'projectOverview',
  defaults: PROJECT_OVERVIEW_DEFAULTS,
})
@Injectable()
export class ProjectOverviewState {
  projectOverviewService = inject(ProjectOverviewService);

  @Action(GetProjectById)
  getProjectById(ctx: StateContext<ProjectOverviewStateModel>, action: GetProjectById) {
    const state = ctx.getState();
    ctx.patchState({
      project: {
        ...state.project,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getProjectById(action.projectId).pipe(
      tap((project) => {
        ctx.patchState({
          project: {
            data: project,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'project', error))
    );
  }

  @Action(ClearProjectOverview)
  clearProjectOverview(ctx: StateContext<ProjectOverviewStateModel>) {
    ctx.patchState(PROJECT_OVERVIEW_DEFAULTS);
  }

  @Action(UpdateProjectPublicStatus)
  updateProjectPublicStatus(ctx: StateContext<ProjectOverviewStateModel>, action: UpdateProjectPublicStatus) {
    const state = ctx.getState();
    if (state.project.data) {
      ctx.patchState({
        project: {
          ...state.project,
          isSubmitting: true,
        },
      });
    }
    return this.projectOverviewService.updateProjectPublicStatus(action.projectId, action.isPublic).pipe(
      tap(() => {
        if (state.project.data) {
          ctx.patchState({
            project: {
              ...state.project,
              data: {
                ...state.project.data!,
                isPublic: action.isPublic,
              },
              isSubmitting: false,
            },
          });
        }
      }),
      catchError((error) => this.handleError(ctx, 'project', error))
    );
  }

  @Action(SetProjectCustomCitation)
  setProjectCustomCitation(ctx: StateContext<ProjectOverviewStateModel>, action: SetProjectCustomCitation) {
    const state = ctx.getState();
    ctx.patchState({
      project: {
        ...state.project,
        data: {
          ...state.project.data!,
          customCitation: action.citation,
        },
      },
    });
  }

  @Action(ForkResource)
  forkResource(ctx: StateContext<ProjectOverviewStateModel>, action: ForkResource) {
    const state = ctx.getState();
    ctx.patchState({
      project: {
        ...state.project,
        isSubmitting: true,
      },
    });

    let resourceType = '';
    switch (action.resourceType) {
      case ResourceType.Project:
        resourceType = 'nodes';
        break;
      case ResourceType.Registration:
        resourceType = 'registrations';
        break;
    }

    return this.projectOverviewService.forkResource(action.resourceId, resourceType).pipe(
      tap(() => {
        ctx.patchState({
          project: {
            ...state.project,
            data: {
              ...state.project.data!,
              forksCount: state.project.data!.forksCount + 1,
            },
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'project', error))
    );
  }

  @Action(DuplicateProject)
  duplicateProject(ctx: StateContext<ProjectOverviewStateModel>, action: DuplicateProject) {
    const state = ctx.getState();
    ctx.patchState({
      project: {
        ...state.project,
        isSubmitting: true,
      },
    });

    return this.projectOverviewService.duplicateProject(action.projectId, action.title).pipe(
      tap(() => {
        ctx.patchState({
          project: {
            ...state.project,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'project', error))
    );
  }

  @Action(CreateComponent)
  createComponent(ctx: StateContext<ProjectOverviewStateModel>, action: CreateComponent) {
    const state = ctx.getState();
    ctx.patchState({
      components: {
        ...state.components,
        isSubmitting: true,
      },
    });

    return this.projectOverviewService
      .createComponent(
        action.projectId,
        action.title,
        action.description,
        action.tags,
        action.region,
        action.affiliatedInstitutions,
        action.inheritContributors
      )
      .pipe(
        tap(() => {
          ctx.patchState({
            components: {
              ...state.components,
              isSubmitting: false,
            },
          });
        }),
        catchError((error) => this.handleError(ctx, 'components', error))
      );
  }

  @Action(DeleteComponent)
  deleteComponent(ctx: StateContext<ProjectOverviewStateModel>, action: DeleteComponent) {
    const state = ctx.getState();
    ctx.patchState({
      components: {
        ...state.components,
        isSubmitting: true,
      },
    });

    return this.projectOverviewService.deleteComponent(action.componentId).pipe(
      tap(() => {
        ctx.patchState({
          components: {
            ...state.components,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'components', error))
    );
  }

  @Action(GetComponents)
  getProjectComponents(ctx: StateContext<ProjectOverviewStateModel>, action: GetComponents) {
    const state = ctx.getState();
    ctx.patchState({
      components: {
        ...state.components,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getComponents(action.projectId).pipe(
      tap((components) => {
        ctx.patchState({
          components: {
            data: components,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'components', error))
    );
  }

  private handleError(
    ctx: StateContext<ProjectOverviewStateModel>,
    section: keyof ProjectOverviewStateModel,
    error: Error
  ) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
