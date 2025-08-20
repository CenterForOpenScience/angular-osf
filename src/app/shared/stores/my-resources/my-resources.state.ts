import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@osf/shared/enums';
import { handleSectionError } from '@osf/shared/helpers';
import { MyResourcesService } from '@osf/shared/services';

import {
  ClearMyResources,
  CreateProject,
  GetMyBookmarks,
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
            },
            totalProjects: res.meta.total,
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
      .getMyRegistrations(action.filters, action.pageNumber, action.pageSize, action.searchMode)
      .pipe(
        tap((res) => {
          ctx.patchState({
            registrations: {
              data: res.data,
              isLoading: false,
              error: null,
            },
            totalRegistrations: res.meta.total,
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
          },
          totalPreprints: res.meta.total,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprints', error))
    );
  }

  @Action(GetMyBookmarks)
  getBookmarks(ctx: StateContext<MyResourcesStateModel>, action: GetMyBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarks: {
        ...state.bookmarks,
        isLoading: true,
        error: null,
      },
    });

    if (action.resourceType !== ResourceType.Null) {
      return this.myResourcesService
        .getMyBookmarks(action.bookmarksId, action.resourceType, action.filters, action.pageNumber, action.pageSize)
        .pipe(
          tap((res) => {
            ctx.patchState({
              bookmarks: {
                data: res.data,
                isLoading: false,
                error: null,
              },
              totalBookmarks: res.meta.total,
            });
          }),
          catchError((error) => handleSectionError(ctx, 'bookmarks', error))
        );
    } else {
      return forkJoin({
        projects: this.myResourcesService.getMyBookmarks(
          action.bookmarksId,
          ResourceType.Project,
          action.filters,
          action.pageNumber,
          action.pageSize
        ),
        preprints: this.myResourcesService.getMyBookmarks(
          action.bookmarksId,
          ResourceType.Preprint,
          action.filters,
          action.pageNumber,
          action.pageSize
        ),
        registrations: this.myResourcesService.getMyBookmarks(
          action.bookmarksId,
          ResourceType.Registration,
          action.filters,
          action.pageNumber,
          action.pageSize
        ),
      }).pipe(
        tap((results) => {
          const allData = [...results.projects.data, ...results.preprints.data, ...results.registrations.data];
          const totalCount =
            results.projects.meta.total + results.preprints.meta.total + results.registrations.meta.total;

          ctx.patchState({
            bookmarks: {
              data: allData,
              isLoading: false,
              error: null,
            },
            totalBookmarks: totalCount,
          });
        }),
        catchError((error) => handleSectionError(ctx, 'bookmarks', error))
      );
    }
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
            },
            totalProjects: state.totalProjects + 1,
          });
        }),
        catchError((error) => handleSectionError(ctx, 'projects', error))
      );
  }
}
