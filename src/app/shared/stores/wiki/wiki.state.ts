import { Action, State, StateContext } from '@ngxs/store';

import { catchError, map, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { WikiService } from '@osf/shared/services/wiki.service';

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
  RenameWiki,
  SetCurrentWiki,
  ToggleMode,
  UpdateWikiPreviewContent,
} from './wiki.actions';
import { WIKI_STATE_DEFAULTS, WikiStateModel } from './wiki.model';

@State<WikiStateModel>({
  name: 'wiki',
  defaults: WIKI_STATE_DEFAULTS,
})
@Injectable()
export class WikiState {
  private readonly wikiService = inject(WikiService);

  @Action(CreateWiki)
  createWiki(ctx: StateContext<WikiStateModel>, action: CreateWiki) {
    const state = ctx.getState();
    ctx.patchState({
      wikiList: {
        ...state.wikiList,
        isSubmitting: true,
      },
    });
    return this.wikiService.createWiki(action.resourceId, action.name).pipe(
      tap((wiki) => {
        ctx.patchState({
          wikiList: {
            ...state.wikiList,
            data: [...state.wikiList.data, wiki],
            isSubmitting: false,
          },
          currentWikiId: wiki.id,
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(RenameWiki)
  renameWiki(ctx: StateContext<WikiStateModel>, action: RenameWiki) {
    const state = ctx.getState();
    ctx.patchState({
      wikiList: {
        ...state.wikiList,
        isSubmitting: true,
      },
    });
    return this.wikiService.renameWiki(action.wikiId, action.name).pipe(
      tap((wiki) => {
        const updatedWiki = wiki.id === action.wikiId ? { ...wiki, name: action.name } : wiki;
        const updatedList = state.wikiList.data.map((w) => (w.id === updatedWiki.id ? updatedWiki : w));
        ctx.patchState({
          wikiList: {
            ...state.wikiList,
            data: [...updatedList],
            isSubmitting: false,
          },
          currentWikiId: updatedWiki.id,
        });
      }),
      catchError((error) => this.handleError(ctx, error))
    );
  }

  @Action(DeleteWiki)
  deleteWiki(ctx: StateContext<WikiStateModel>, action: DeleteWiki) {
    const state = ctx.getState();
    ctx.patchState({
      wikiList: {
        ...state.wikiList,
        isSubmitting: true,
        isLoading: true,
      },
    });

    return this.wikiService.deleteWiki(action.wikiId).pipe(
      tap(() => {
        const updatedList = state.wikiList.data.filter((wiki) => wiki.id !== action.wikiId);
        ctx.patchState({
          wikiList: {
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

    return this.wikiService.getHomeWiki(action.resourceType, action.resourceId).pipe(
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
    ctx.setState(WIKI_STATE_DEFAULTS);
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
      wikiList: {
        ...state.wikiList,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getWikiList(action.resourceType, action.resourceId).pipe(
      tap((response) => {
        const wiki = response.wikis.sort((a, b) => {
          if (a.name === 'Home') return -1;
          if (b.name === 'Home') return 1;
          return a.name.localeCompare(b.name);
        });

        ctx.patchState({
          wikiList: {
            data: [...wiki],
            isLoading: false,
            error: null,
          },
          isAnonymous: response.meta?.anonymous ?? false,
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
      componentsWikiList: {
        ...state.componentsWikiList,
        isLoading: true,
        error: null,
      },
    });

    return this.wikiService.getComponentsWikiList(action.resourceType, action.resourceId).pipe(
      tap((componentsWiki) => {
        ctx.patchState({
          componentsWikiList: {
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
      wikiList: {
        ...ctx.getState().wikiList,
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
