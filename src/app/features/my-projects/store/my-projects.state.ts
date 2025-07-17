import { Action, State, StateContext } from '@ngxs/store';

import { catchError, forkJoin, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';
import { ResourceType } from '@shared/enums';

import { MyProjectsService } from '../services';

import {
  ClearMyProjects,
  CreateProject,
  GetMyBookmarks,
  GetMyPreprints,
  GetMyProjects,
  GetMyRegistrations,
} from './my-projects.actions';
import { MY_PROJECT_STATE_DEFAULTS, MyProjectsStateModel } from './my-projects.model';

@State<MyProjectsStateModel>({
  name: 'myProjects',
  defaults: MY_PROJECT_STATE_DEFAULTS,
})
@Injectable()
export class MyProjectsState {
  private readonly myProjectsService = inject(MyProjectsService);

  @Action(GetMyProjects)
  getProjects(ctx: StateContext<MyProjectsStateModel>, action: GetMyProjects) {
    const state = ctx.getState();
    ctx.patchState({
      projects: {
        ...state.projects,
        isLoading: true,
      },
    });

    return this.myProjectsService.getMyProjects(action.filters, action.pageNumber, action.pageSize).pipe(
      tap((res) => {
        ctx.patchState({
          projects: {
            data: res.data,
            isLoading: false,
            error: null,
          },
          totalProjects: res.links.meta.total,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'projects', error))
    );
  }

  @Action(GetMyRegistrations)
  getRegistrations(ctx: StateContext<MyProjectsStateModel>, action: GetMyRegistrations) {
    const state = ctx.getState();
    ctx.patchState({
      registrations: {
        ...state.registrations,
        isLoading: true,
      },
    });

    return this.myProjectsService.getMyRegistrations(action.filters, action.pageNumber, action.pageSize).pipe(
      tap((res) => {
        ctx.patchState({
          registrations: {
            data: res.data,
            isLoading: false,
            error: null,
          },
          totalRegistrations: res.links.meta.total,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'registrations', error))
    );
  }

  @Action(GetMyPreprints)
  getPreprints(ctx: StateContext<MyProjectsStateModel>, action: GetMyPreprints) {
    const state = ctx.getState();
    ctx.patchState({
      preprints: {
        ...state.preprints,
        isLoading: true,
      },
    });

    return this.myProjectsService.getMyPreprints(action.filters, action.pageNumber, action.pageSize).pipe(
      tap((res) => {
        ctx.patchState({
          preprints: {
            data: res.data,
            isLoading: false,
            error: null,
          },
          totalPreprints: res.links.meta.total,
        });
      }),
      catchError((error) => handleSectionError(ctx, 'preprints', error))
    );
  }

  @Action(GetMyBookmarks)
  getBookmarks(ctx: StateContext<MyProjectsStateModel>, action: GetMyBookmarks) {
    const state = ctx.getState();
    ctx.patchState({
      bookmarks: {
        ...state.bookmarks,
        isLoading: true,
        error: null,
      },
    });

    if (action.resourceType !== ResourceType.Null) {
      return this.myProjectsService
        .getMyBookmarks(action.bookmarksId, action.resourceType, action.filters, action.pageNumber, action.pageSize)
        .pipe(
          tap((res) => {
            ctx.patchState({
              bookmarks: {
                data: res.data,
                isLoading: false,
                error: null,
              },
              totalBookmarks: res.links.meta.total,
            });
          }),
          catchError((error) => handleSectionError(ctx, 'bookmarks', error))
        );
    } else {
      return forkJoin({
        projects: this.myProjectsService.getMyBookmarks(
          action.bookmarksId,
          ResourceType.Project,
          action.filters,
          action.pageNumber,
          action.pageSize
        ),
        preprints: this.myProjectsService.getMyBookmarks(
          action.bookmarksId,
          ResourceType.Preprint,
          action.filters,
          action.pageNumber,
          action.pageSize
        ),
        registrations: this.myProjectsService.getMyBookmarks(
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
            results.projects.links.meta.total +
            results.preprints.links.meta.total +
            results.registrations.links.meta.total;

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

  @Action(ClearMyProjects)
  clearMyProjects(ctx: StateContext<MyProjectsStateModel>) {
    ctx.patchState(MY_PROJECT_STATE_DEFAULTS);
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<MyProjectsStateModel>, action: CreateProject) {
    const state = ctx.getState();
    ctx.patchState({
      projects: {
        ...state.projects,
        isSubmitting: true,
      },
    });

    return this.myProjectsService
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
