import { Action, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { PreprintsService } from '@osf/features/preprints/services';
import { FilesService } from '@shared/services';

import {
  FetchMyPreprints,
  FetchPreprintById,
  FetchPreprintFile,
  FetchPreprintFileVersions,
  ResetState,
} from './preprint.actions';
import { DefaultState, PreprintStateModel } from './preprint.model';

@State<PreprintStateModel>({
  name: 'preprints',
  defaults: { ...DefaultState },
})
@Injectable()
export class PreprintState {
  private store = inject(Store);
  private preprintsService = inject(PreprintsService);
  private fileService = inject(FilesService);

  @Action(FetchMyPreprints)
  fetchMyPreprints(ctx: StateContext<PreprintStateModel>, action: FetchMyPreprints) {
    ctx.setState(patch({ myPreprints: patch({ isLoading: true }) }));

    return this.preprintsService.getMyPreprints(action.pageNumber, action.pageSize, action.filters).pipe(
      tap((preprints) => {
        ctx.setState(
          patch({
            myPreprints: patch({
              isLoading: false,
              data: preprints.data,
              totalCount: preprints.totalCount,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'myPreprints', error))
    );
  }

  @Action(FetchPreprintById)
  fetchPreprintById(ctx: StateContext<PreprintStateModel>, action: FetchPreprintById) {
    ctx.setState(patch({ preprint: patch({ isLoading: true }) }));

    return this.preprintsService.getByIdWithEmbeds(action.id).pipe(
      tap((preprint) => {
        ctx.setState(patch({ preprint: patch({ isLoading: false, data: preprint }) }));
        this.store.dispatch(new FetchPreprintFile());
      }),
      catchError((error) => handleSectionError(ctx, 'preprint', error))
    );
  }

  @Action(FetchPreprintFile)
  fetchPreprintFile(ctx: StateContext<PreprintStateModel>) {
    const preprintFileId = ctx.getState().preprint.data?.primaryFileId;
    if (!preprintFileId) return;
    ctx.setState(patch({ preprintFile: patch({ isLoading: true }) }));

    return this.fileService.getFileById(preprintFileId!).pipe(
      tap((file) => {
        ctx.setState(patch({ preprintFile: patch({ isLoading: false, data: file }) }));
        this.store.dispatch(new FetchPreprintFileVersions());
      }),
      catchError((error) => handleSectionError(ctx, 'preprintFile', error))
    );
  }

  @Action(FetchPreprintFileVersions)
  fetchPreprintFileVersions(ctx: StateContext<PreprintStateModel>) {
    const fileId = ctx.getState().preprintFile.data?.id;
    if (!fileId) return;

    ctx.setState(patch({ fileVersions: patch({ isLoading: true }) }));

    return this.fileService.getFileVersions(fileId).pipe(
      tap((fileVersions) => {
        ctx.setState(patch({ fileVersions: patch({ isLoading: false, data: fileVersions }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'fileVersions', error))
    );
  }

  @Action(ResetState)
  resetState(ctx: StateContext<PreprintStateModel>) {
    ctx.setState(patch({ ...DefaultState }));
  }
}
