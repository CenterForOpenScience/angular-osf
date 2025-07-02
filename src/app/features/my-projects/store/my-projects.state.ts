import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MyProjectsService } from '../services';

import {
  ClearMyProjects,
  CreateProject,
  GetMyBookmarks,
  GetMyPreprints,
  GetMyProjects,
  GetMyRegistrations,
} from './my-projects.actions';
import { MyProjectsStateModel } from './my-projects.model';

@State<MyProjectsStateModel>({
  name: 'myProjects',
  defaults: {
    projects: {
      data: [],
      isLoading: false,
      error: null,
    },
    registrations: {
      data: [],
      isLoading: false,
      error: null,
    },
    preprints: {
      data: [],
      isLoading: false,
      error: null,
    },
    bookmarks: {
      data: [],
      isLoading: false,
      error: null,
    },
    totalProjects: 0,
    totalRegistrations: 0,
    totalPreprints: 0,
    totalBookmarks: 0,
  },
})
@Injectable()
export class MyProjectsState {
  myProjectsService = inject(MyProjectsService);

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
      catchError((error) => this.handleError(ctx, 'projects', error))
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
      catchError((error) => this.handleError(ctx, 'registrations', error))
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
      catchError((error) => this.handleError(ctx, 'preprints', error))
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

    return this.myProjectsService
      .getMyBookmarks(action.bookmarksId, action.filters, action.pageNumber, action.pageSize)
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
        catchError((error) => this.handleError(ctx, 'bookmarks', error))
      );
  }

  @Action(ClearMyProjects)
  clearMyProjects(ctx: StateContext<MyProjectsStateModel>) {
    ctx.patchState({
      projects: {
        data: [],
        isLoading: false,
        error: null,
      },
      registrations: {
        data: [],
        isLoading: false,
        error: null,
      },
      preprints: {
        data: [],
        isLoading: false,
        error: null,
      },
      bookmarks: {
        data: [],
        isLoading: false,
        error: null,
      },
      totalProjects: 0,
      totalRegistrations: 0,
      totalPreprints: 0,
      totalBookmarks: 0,
    });
  }

  @Action(CreateProject)
  createProject(ctx: StateContext<MyProjectsStateModel>, action: CreateProject) {
    const state = ctx.getState();
    ctx.patchState({
      projects: {
        ...state.projects,
        isLoading: true,
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
              error: null,
            },
            totalProjects: state.totalProjects + 1,
          });
        }),
        catchError((error) => this.handleError(ctx, 'projects', error))
      );
  }

  private handleError(ctx: StateContext<MyProjectsStateModel>, section: keyof MyProjectsStateModel, error: Error) {
    const state = ctx.getState();
    if (section === 'projects' || section === 'registrations' || section === 'preprints' || section === 'bookmarks') {
      ctx.patchState({
        [section]: {
          ...state[section],
          isLoading: false,
          error: error.message,
        },
      });
    }

    return throwError(() => error);
  }
}
