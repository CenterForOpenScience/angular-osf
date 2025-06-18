import { Action, State, StateContext } from '@ngxs/store';

import { catchError, map, tap, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { WikiService } from '../services';

import {
  ClearWiki,
  CreateWiki,
  CreateWikiVersion,
  DeleteWiki,
  GetCompareVersionContent,
  GetComponentsWikiList,
  GetHomeWiki,
  GetWikiList,
  GetWikiVersionContent,
  GetWikiVersions,
  SetCurrentWiki,
  ToggleMode,
  UpdateWikiPreviewContent,
} from './wiki.actions';
import { WikiStateModel } from './wiki.model';

const DefaultState: WikiStateModel = {
  homeWikiContent: {
    data: '',
    isLoading: false,
    error: null,
  },
  wikiModes: {
    view: true,
    edit: false,
    compare: false,
  },
  projectWikiList: {
    data: [],
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  projectComponentsWikiList: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentWikiId: '',
  previewContent: '',
  wikiVersions: {
    data: [],
    isLoading: false,
    error: null,
  },
  versionContent: {
    data: '',
    isLoading: false,
    error: null,
  },
  compareVersionContent: {
    data: '',
    isLoading: false,
    error: null,
  },
};

@State<WikiStateModel>({
  name: 'wiki',
  defaults: { ...DefaultState },
})
@Injectable()
export class WikiState {
  constructor(private wikiService: WikiService) {}

  @Action(CreateWiki)
  createWiki(ctx: StateContext<WikiStateModel>, action: CreateWiki) {
    const state = ctx.getState();
    ctx.patchState({
      projectWikiList: {
        ...state.projectWikiList,
        isSubmitting: true,
      },
    });
    return this.wikiService.createWiki(action.projectId, action.name).pipe(
      tap((wiki) => {
        ctx.patchState({
          projectWikiList: {
            ...state.projectWikiList,
            data: [...state.projectWikiList.data, wiki],
            isSubmitting: false,
          },
          currentWikiId: wiki.id,
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(DeleteWiki)
  deleteWiki(ctx: StateContext<WikiStateModel>, action: DeleteWiki) {
    const state = ctx.getState();
    ctx.patchState({
      projectWikiList: {
        ...state.projectWikiList,
        isSubmitting: true,
        isLoading: true,
      },
    });

    return this.wikiService.deleteWiki(action.wikiId).pipe(
      tap(() => {
        const updatedList = state.projectWikiList.data.filter((wiki) => wiki.id !== action.wikiId);
        ctx.patchState({
          projectWikiList: {
            data: updatedList,
            isSubmitting: false,
            error: null,
            isLoading: false,
          },
          currentWikiId: updatedList.length > 0 ? updatedList[0].id : '',
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(GetHomeWiki)
  getHomeWiki(ctx: StateContext<WikiStateModel>, action: GetHomeWiki) {
    const state = ctx.getState();
    ctx.patchState({
      homeWikiContent: {
        ...state.homeWikiContent,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getHomeWiki(action.projectId).pipe(
      tap((content) => {
        ctx.patchState({
          homeWikiContent: {
            data: content,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(ClearWiki)
  clearWiki(ctx: StateContext<WikiStateModel>) {
    ctx.patchState({
      homeWikiContent: { ...DefaultState.homeWikiContent },
      wikiModes: { ...DefaultState.wikiModes },
      projectWikiList: { ...DefaultState.projectWikiList },
      projectComponentsWikiList: { ...DefaultState.projectComponentsWikiList },
      currentWikiId: DefaultState.currentWikiId,
      previewContent: DefaultState.previewContent,
      wikiVersions: { ...DefaultState.wikiVersions },
      versionContent: { ...DefaultState.versionContent },
      compareVersionContent: { ...DefaultState.compareVersionContent },
    });
  }

  @Action(ToggleMode)
  toggleMode(ctx: StateContext<WikiStateModel>, action: ToggleMode) {
    const state = ctx.getState();

    const trueModesCount = Object.values(state.wikiModes).filter(Boolean).length;

    if (trueModesCount >= 2 || !state.wikiModes[action.mode]) {
      ctx.patchState({
        wikiModes: { ...state.wikiModes, [`${action.mode}`]: !state.wikiModes[action.mode] },
      });
    }
  }

  @Action(GetWikiList)
  getWikiList(ctx: StateContext<WikiStateModel>, action: GetWikiList) {
    const state = ctx.getState();
    ctx.patchState({
      projectWikiList: {
        ...state.projectWikiList,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getWikiList(action.projectId).pipe(
      tap((list) => {
        ctx.patchState({
          projectWikiList: {
            data: [...list],
            isLoading: false,
            error: null,
          },
        });
      }),
      map((wiki) => wiki),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(GetComponentsWikiList)
  getComponentsWikiList(ctx: StateContext<WikiStateModel>, action: GetComponentsWikiList) {
    const state = ctx.getState();

    ctx.patchState({
      projectComponentsWikiList: {
        ...state.projectComponentsWikiList,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getComponentsWikiList(action.projectId).pipe(
      tap((componentsWiki) => {
        ctx.patchState({
          projectComponentsWikiList: {
            data: [...componentsWiki],
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(UpdateWikiPreviewContent)
  updateWikiContent(ctx: StateContext<WikiStateModel>, action: UpdateWikiPreviewContent) {
    ctx.patchState({
      previewContent: action.content,
    });
  }

  @Action(SetCurrentWiki)
  setCurrentWiki(ctx: StateContext<WikiStateModel>, action: SetCurrentWiki) {
    ctx.patchState({
      currentWikiId: action.wikiId,
      previewContent: '',
      versionContent: {
        data: '',
        isLoading: false,
        error: null,
        isSubmitting: false,
      },
    });
  }

  private handleError(ctx: StateContext<WikiStateModel>, error: Error) {
    ctx.patchState({
      homeWikiContent: {
        ...ctx.getState().homeWikiContent,
        isLoading: false,
        error: error.message,
      },
      projectWikiList: {
        ...ctx.getState().projectWikiList,
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }

  @Action(GetWikiVersions)
  getWikiVersions(ctx: StateContext<WikiStateModel>, action: GetWikiVersions) {
    const state = ctx.getState();
    ctx.patchState({
      wikiVersions: {
        ...state.wikiVersions,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getWikiVersions(action.wikiId).pipe(
      tap((versions) => {
        ctx.patchState({
          wikiVersions: {
            data: [...versions],
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(CreateWikiVersion)
  createWikiVersion(ctx: StateContext<WikiStateModel>, action: CreateWikiVersion) {
    ctx.patchState({
      versionContent: { data: action.content, isLoading: true, error: null, isSubmitting: true },
    });

    return this.wikiService.createWikiVersion(action.wikiId, action.content).pipe(
      tap(() => {
        ctx.patchState({
          versionContent: {
            data: action.content,
            isLoading: false,
            error: null,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(GetWikiVersionContent)
  getWikiVersionContent(ctx: StateContext<WikiStateModel>, action: GetWikiVersionContent) {
    const state = ctx.getState();
    ctx.patchState({
      versionContent: {
        ...state.versionContent,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getWikiVersionContent(action.wikiId, action.versionId).pipe(
      tap((content) => {
        ctx.patchState({
          previewContent: content,
          versionContent: {
            data: content,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(GetCompareVersionContent)
  getCompareVersionContent(ctx: StateContext<WikiStateModel>, action: GetCompareVersionContent) {
    const state = ctx.getState();
    ctx.patchState({
      compareVersionContent: {
        ...state.compareVersionContent,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getWikiVersionContent(action.wikiId, action.versionId).pipe(
      tap((content) => {
        ctx.patchState({
          compareVersionContent: {
            data: content,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }
}
