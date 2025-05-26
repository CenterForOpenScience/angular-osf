import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { WikiService } from '../services';

import { ClearWiki, GetHomeWiki } from './wiki.actions';
import { WikiStateModel } from './wiki.model';

@State<WikiStateModel>({
  name: 'wiki',
  defaults: {
    homeWikiContent: {
      data: '',
      isLoading: false,
      error: null,
    },
  },
})
@Injectable()
export class WikiState {
  constructor(private wikiService: WikiService) {}

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
      homeWikiContent: {
        data: '',
        isLoading: false,
        error: null,
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
    });
    return throwError(() => error);
  }
}
