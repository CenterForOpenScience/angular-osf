import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { MyResourcesService } from '@osf/shared/services/my-resources.service';

import {
  ClearMyResources,
  CreateProject,
  GetMyPreprints,
  GetMyProjects,
  GetMyRegistrations,
} from './my-resources.actions';
import { MY_RESOURCES_STATE_DEFAULTS, MyResourcesStateModel } from './my-resources.model';

@State<MyResourcesStateModel>({
  name: 'myResources',
  defaults: MY_RESOURCES_STATE_DEFAULTS,
})
@Injectable()
export class MyResourcesState {
  private readonly myResourcesService = inject(MyResourcesService);

  @Action(GetMyProjects)
  getProjects(ctx: StateContext<MyResourcesStateModel>, action: GetMyProjects) {
    const state = ctx.getState();
    ctx.patchState({
      projects: {
        ...state.projects,
        isLoading: true,
      },
    });

    return this.myResourcesService
      .getMyProjects(action.filters, action.pageNumber, action.pageSize, action.searchMode, action.rootProjectId)
      .pipe(
        tap((res) => {
          ctx.patchState({
            projects: {
              data: res.data,
              isLoading: false,
              error: null,
              totalCount: res.meta.total,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'projects', error))
      );
  }

  @Action(GetMyRegistrations)
  getRegistrations(ctx: StateContext<MyResourcesStateModel>, action: GetMyRegistrations) {
    const state = ctx.getState();
    ctx.patchState({
      registrations: {
        ...state.registrations,
        isLoading: true,
      },
    });

    return this.myResourcesService
      .getMyRegistrations(
        action.filters,
        action.pageNumber,
        action.pageSize,
        action.searchMode,
        action.rootRegistrationId
      )
      .pipe(
        tap((res) => {
          ctx.patchState({
            registrations: {
              data: res.data,
              isLoading: false,
              error: null,
              totalCount: res.meta.total,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'registrations', error))
      );
  }

  @Action(GetMyPreprints)
  getPreprints(ctx: StateContext<MyResourcesStateModel>, action: GetMyPreprints) {
    const state = ctx.getState();
    ctx.patchState({
      preprints: {
        ...state.preprints,
        isLoading: true,
      },
    });

    return this.myResourcesService.getMyPreprints(action.filters, action.pageNumber, action.pageSize).pipe(
      tap((res) => {
        ctx.patchState({
          preprints: {
            data: res.data,
            isLoading: false,
            error: null,
            totalCount: res.meta.total,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprints', error))
    );
  }

  @Action(ClearMyResources)
  clearMyResources(ctx: StateContext<MyResourcesStateModel>) {
    ctx.patchState(MY_RESOURCES_STATE_DEFAULTS);
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<MyResourcesStateModel>, action: CreateProject) {
    const state = ctx.getState();
    ctx.patchState({
      projects: {
        ...state.projects,
        isSubmitting: true,
      },
    });

    return this.myResourcesService
      .createProject(action.title, action.description, action.templateFrom, action.region, action.affiliations)
      .pipe(
        tap((project) => {
          ctx.patchState({
            projects: {
              data: [project, ...state.projects.data],
              isLoading: false,
              isSubmitting: false,
              error: null,
              totalCount: state.projects.totalCount + 1,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'projects', error))
      );
  }
}
