import { Action, Actions, ofActionDispatched, State, StateContext } from '@ngxs/store';

import { catchError, Observable, takeUntil, tap } from 'rxjs';

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
  private readonly actions$ = inject(Actions);
  private readonly myResourcesService = inject(MyResourcesService);

  @Action(GetMyProjects, { cancelUncompleted: true })
  getProjects(ctx: StateContext<MyResourcesStateModel>, action: GetMyProjects) {
    ctx.patchState({
      projects: {
        ...ctx.getState().projects,
        isLoading: true,
        error: null,
      },
    });

    return this.untilCleared(
      this.myResourcesService
        .getMyProjects(action.filters, action.pageNumber, action.pageSize, action.searchMode, action.visibilityFilter)
        .pipe(
          tap((res) => {
            const projects = ctx.getState().projects;
            ctx.patchState({
              projects: {
                ...projects,
                data: res.data,
                isLoading: false,
                error: null,
                totalCount: res.totalCount,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'projects', error))
        )
    );
  }

  @Action(GetMyRegistrations, { cancelUncompleted: true })
  getRegistrations(ctx: StateContext<MyResourcesStateModel>, action: GetMyRegistrations) {
    ctx.patchState({
      registrations: {
        ...ctx.getState().registrations,
        isLoading: true,
        error: null,
      },
    });

    return this.untilCleared(
      this.myResourcesService
        .getMyRegistrations(action.filters, action.pageNumber, action.pageSize, action.searchMode)
        .pipe(
          tap((res) => {
            const registrations = ctx.getState().registrations;
            ctx.patchState({
              registrations: {
                ...registrations,
                data: res.data,
                isLoading: false,
                error: null,
                totalCount: res.totalCount,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'registrations', error))
        )
    );
  }

  @Action(GetMyPreprints, { cancelUncompleted: true })
  getPreprints(ctx: StateContext<MyResourcesStateModel>, action: GetMyPreprints) {
    ctx.patchState({
      preprints: {
        ...ctx.getState().preprints,
        isLoading: true,
        error: null,
      },
    });

    return this.untilCleared(
      this.myResourcesService.getMyPreprints(action.filters, action.pageNumber, action.pageSize).pipe(
        tap((res) => {
          const preprints = ctx.getState().preprints;
          ctx.patchState({
            preprints: {
              ...preprints,
              data: res.data,
              isLoading: false,
              error: null,
              totalCount: res.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'preprints', error))
      )
    );
  }

  @Action(ClearMyResources)
  clearMyResources(ctx: StateContext<MyResourcesStateModel>) {
    ctx.patchState(MY_RESOURCES_STATE_DEFAULTS);
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<MyResourcesStateModel>, action: CreateProject) {
    ctx.patchState({
      projects: {
        ...ctx.getState().projects,
        isSubmitting: true,
        error: null,
      },
    });

    return this.untilCleared(
      this.myResourcesService
        .createProject(action.title, action.description, action.templateFrom, action.region, action.affiliations)
        .pipe(
          tap((project) => {
            const projects = ctx.getState().projects;
            ctx.patchState({
              projects: {
                ...projects,
                data: [project, ...projects.data],
                isSubmitting: false,
                error: null,
                totalCount: projects.totalCount + 1,
              },
            });
          }),
          catchError((error) => handleSectionError(ctx, 'projects', error))
        )
    );
  }

  private untilCleared<T>(source: Observable<T>): Observable<T> {
    return source.pipe(takeUntil(this.actions$.pipe(ofActionDispatched(ClearMyResources))));
  }
}
