import { inject, Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { MyProjectsStateModel } from './my-projects.model';
import {
  GetMyProjects,
  GetMyRegistrations,
  GetMyPreprints,
  GetMyBookmarks,
  GetBookmarksCollectionId,
  ClearMyProjects,
} from './my-projects.actions';
import { MyProjectsService } from '@osf/features/my-projects/my-projects.service';
import { tap } from 'rxjs';

@State<MyProjectsStateModel>({
  name: 'myProjects',
  defaults: {
    projects: [],
    registrations: [],
    preprints: [],
    bookmarks: [],
    totalProjects: 0,
    totalRegistrations: 0,
    totalPreprints: 0,
    totalBookmarks: 0,
    bookmarksId: '',
  },
})
@Injectable()
export class MyProjectsState {
  myProjectsService = inject(MyProjectsService);

  @Action(GetMyProjects)
  getProjects(ctx: StateContext<MyProjectsStateModel>, action: GetMyProjects) {
    return this.myProjectsService
      .getMyProjects(action.filters, action.pageNumber, action.pageSize)
      .pipe(
        tap((res) => {
          ctx.patchState({
            projects: res.data,
            totalProjects: res.links.meta.total,
          });
        }),
      );
  }

  @Action(GetMyRegistrations)
  getRegistrations(
    ctx: StateContext<MyProjectsStateModel>,
    action: GetMyRegistrations,
  ) {
    return this.myProjectsService
      .getMyRegistrations(action.filters, action.pageNumber, action.pageSize)
      .pipe(
        tap((res) => {
          ctx.patchState({
            registrations: res.data,
            totalRegistrations: res.links.meta.total,
          });
        }),
      );
  }

  @Action(GetMyPreprints)
  getPreprints(
    ctx: StateContext<MyProjectsStateModel>,
    action: GetMyPreprints,
  ) {
    return this.myProjectsService
      .getMyPreprints(action.filters, action.pageNumber, action.pageSize)
      .pipe(
        tap((res) => {
          ctx.patchState({
            preprints: res.data,
            totalPreprints: res.links.meta.total,
          });
        }),
      );
  }

  @Action(GetMyBookmarks)
  getBookmarks(
    ctx: StateContext<MyProjectsStateModel>,
    action: GetMyBookmarks,
  ) {
    return this.myProjectsService
      .getMyBookmarks(
        action.bookmarksId,
        action.filters,
        action.pageNumber,
        action.pageSize,
      )
      .pipe(
        tap((res) => {
          ctx.patchState({
            bookmarks: res.data,
            totalBookmarks: res.links.meta.total,
          });
        }),
      );
  }

  @Action(GetBookmarksCollectionId)
  getBookmarksCollectionId(ctx: StateContext<MyProjectsStateModel>) {
    return this.myProjectsService.getBookmarksCollectionId().pipe(
      tap((res) => {
        ctx.patchState({
          bookmarksId: res,
        });
      }),
    );
  }

  @Action(ClearMyProjects)
  clearMyProjects(ctx: StateContext<MyProjectsStateModel>) {
    ctx.patchState({
      projects: [],
      registrations: [],
      preprints: [],
      bookmarks: [],
      totalProjects: 0,
      totalRegistrations: 0,
      totalPreprints: 0,
      totalBookmarks: 0,
    });
  }
}
