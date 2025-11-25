import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { ResourceType } from '@shared/enums/resource-type.enum';

import { ProjectOverviewService } from '../services';

import {
  ClearDuplicatedProject,
  ClearProjectOverview,
  CreateComponent,
  DeleteComponent,
  DuplicateProject,
  ForkResource,
  GetComponents,
  GetParentProject,
  GetProjectById,
  GetProjectIdentifiers,
  GetProjectInstitutions,
  GetProjectLicense,
  GetProjectPreprints,
  GetProjectStorage,
  LoadMoreComponents,
  ReorderComponents,
  SetProjectCustomCitation,
  UpdateProjectPublicStatus,
} from './project-overview.actions';
import { PROJECT_OVERVIEW_DEFAULTS, ProjectOverviewStateModel } from './project-overview.model';

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
      tap((response) => {
        ctx.patchState({
          project: {
            data: response.project,
            isLoading: false,
            error: null,
          },
          isAnonymous: response.meta?.anonymous ?? false,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'project', error))
    );
  }

  @Action(GetProjectInstitutions)
  getProjectInstitutions(ctx: StateContext<ProjectOverviewStateModel>, action: GetProjectInstitutions) {
    const state = ctx.getState();
    ctx.patchState({
      institutions: {
        ...state.institutions,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getProjectInstitutions(action.projectId).pipe(
      tap((institutions) => {
        ctx.patchState({
          institutions: {
            data: institutions,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'institutions', error))
    );
  }

  @Action(GetProjectIdentifiers)
  getProjectIdentifiers(ctx: StateContext<ProjectOverviewStateModel>, action: GetProjectIdentifiers) {
    const state = ctx.getState();
    ctx.patchState({
      identifiers: {
        ...state.identifiers,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getProjectIdentifiers(action.projectId).pipe(
      tap((identifiers) => {
        ctx.patchState({
          identifiers: {
            data: identifiers,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'identifiers', error))
    );
  }

  @Action(GetProjectLicense)
  getProjectLicense(ctx: StateContext<ProjectOverviewStateModel>, action: GetProjectLicense) {
    if (!action.licenseId) {
      return;
    }

    const state = ctx.getState();

    ctx.patchState({
      license: {
        ...state.license,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getProjectLicense(action.licenseId).pipe(
      tap((license) => {
        ctx.patchState({
          license: {
            data: license,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'license', error))
    );
  }

  @Action(GetProjectStorage)
  getProjectStorage(ctx: StateContext<ProjectOverviewStateModel>, action: GetProjectStorage) {
    const state = ctx.getState();
    ctx.patchState({
      storage: {
        ...state.storage,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getProjectStorage(action.projectId).pipe(
      tap((storage) => {
        ctx.patchState({
          storage: {
            data: storage,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'storage', error))
    );
  }

  @Action(GetProjectPreprints)
  getProjectPreprints(ctx: StateContext<ProjectOverviewStateModel>, action: GetProjectPreprints) {
    const state = ctx.getState();
    ctx.patchState({
      preprints: {
        ...state.preprints,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getProjectPreprints(action.projectId).pipe(
      tap((preprints) => {
        ctx.patchState({
          preprints: {
            data: preprints,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprints', error))
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

    return this.projectOverviewService.updateProjectPublicStatus(action.payload).pipe(
      tap((res) => {
        const project = res.find((item) => item.id === state.project.data?.id);

        if (project) {
          const updatedComponents = state.components.data.map((component) => {
            const updatedComponent = res.find((item) => item.id === component.id);
            return updatedComponent ? { ...component, public: updatedComponent.isPublic } : component;
          });

          ctx.patchState({
            project: {
              ...state.project,
              data: {
                ...state.project.data!,
                isPublic: project.isPublic,
              },
              isSubmitting: false,
            },
            components: {
              ...state.components,
              data: updatedComponents,
            },
          });
        }
      }),
      catchError((error) => handleSectionError(ctx, 'project', error))
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
      catchError((error) => handleSectionError(ctx, 'project', error))
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
      tap((response) => {
        ctx.patchState({
          project: {
            ...state.project,
            isSubmitting: false,
          },
          duplicatedProject: response,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'project', error))
    );
  }

  @Action(ClearDuplicatedProject)
  clearDuplicatedProject(ctx: StateContext<ProjectOverviewStateModel>) {
    ctx.patchState({
      duplicatedProject: null,
    });
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
        catchError((error) => handleSectionError(ctx, 'components', error))
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
      catchError((error) => handleSectionError(ctx, 'components', error))
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

    return this.projectOverviewService.getComponents(action.projectId, action.page, action.pageSize).pipe(
      tap((response) => {
        const data = action.page === 1 ? response.data : [...state.components.data, ...response.data];

        ctx.patchState({
          components: {
            data,
            isLoading: false,
            error: null,
            currentPage: action.page,
            totalCount: response.totalCount,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'components', error))
    );
  }

  @Action(LoadMoreComponents)
  loadMoreComponents(ctx: StateContext<ProjectOverviewStateModel>, action: LoadMoreComponents) {
    const state = ctx.getState();
    const nextPage = state.components.currentPage + 1;

    return ctx.dispatch(new GetComponents(action.projectId, nextPage, 10));
  }

  @Action(GetParentProject)
  getParentProject(ctx: StateContext<ProjectOverviewStateModel>, action: GetParentProject) {
    const state = ctx.getState();
    ctx.patchState({
      parentProject: {
        ...state.parentProject,
        isLoading: true,
      },
    });

    return this.projectOverviewService.getParentProject(action.projectId).pipe(
      tap((project) => {
        ctx.patchState({
          parentProject: {
            data: project,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'parentProject', error))
    );
  }

  @Action(ReorderComponents)
  reorderComponents(ctx: StateContext<ProjectOverviewStateModel>, action: ReorderComponents) {
    const state = ctx.getState();
    ctx.patchState({
      components: {
        ...state.components,
        isSubmitting: true,
      },
    });

    return this.projectOverviewService.reorderComponents(action.projectId, action.componentIds).pipe(
      tap(() => {
        const reorderedComponents = action.componentIds
          .map((id) => state.components.data.find((c) => c.id === id))
          .filter((c) => c !== undefined);

        ctx.patchState({
          components: {
            ...state.components,
            data: reorderedComponents,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'components', error))
    );
  }
}
