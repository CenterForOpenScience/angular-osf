import { Action, State, StateContext } from '@ngxs/store';
import { append, patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { PreprintsService } from '@osf/features/preprints/services';
import { handleSectionError } from '@shared/helpers';
import { FilesService } from '@shared/services';

import {
  FetchMyPreprints,
  FetchPreprintById,
  FetchPreprintFile,
  FetchPreprintFileVersions,
  FetchPreprintRequestActions,
  FetchPreprintRequests,
  FetchPreprintReviewActions,
  FetchPreprintVersionIds,
  ResetState,
  SubmitRequestsDecision,
  SubmitReviewsDecision,
  WithdrawPreprint,
} from './preprint.actions';
import { DefaultState, PreprintStateModel } from './preprint.model';

@State<PreprintStateModel>({
  name: 'preprints',
  defaults: { ...DefaultState },
})
@Injectable()
export class PreprintState {
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
    ctx.setState(
      patch({
        preprint: patch({ isLoading: true, data: null }),
        preprintFile: patch({ isLoading: true, data: null }),
        fileVersions: patch({ isLoading: true, data: [] }),
        preprintReviewActions: patch({ isLoading: false, data: [] }),
        preprintRequests: patch({ isLoading: false, data: [] }),
        preprintRequestsActions: patch({ isLoading: false, data: [] }),
      })
    );

    return this.preprintsService.getByIdWithEmbeds(action.id).pipe(
      tap((preprint) => {
        ctx.setState(patch({ preprint: patch({ isLoading: false, data: preprint }) }));
        if (!preprint.dateWithdrawn) {
          ctx.dispatch(new FetchPreprintFile());
        }
        ctx.dispatch(new FetchPreprintVersionIds());
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
        ctx.dispatch(new FetchPreprintFileVersions());
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

  @Action(FetchPreprintVersionIds)
  fetchPreprintVersionIds(ctx: StateContext<PreprintStateModel>) {
    const preprintId = ctx.getState().preprint.data?.id;
    if (!preprintId) return;

    ctx.setState(patch({ preprintVersionIds: patch({ isLoading: true }) }));

    return this.preprintsService.getPreprintVersionIds(preprintId).pipe(
      tap((versionIds) => {
        ctx.setState(patch({ preprintVersionIds: patch({ isLoading: false, data: versionIds }) }));
      }),
      catchError((error) => handleSectionError(ctx, 'preprintVersionIds', error))
    );
  }

  @Action(FetchPreprintReviewActions)
  fetchPreprintReviewActions(ctx: StateContext<PreprintStateModel>) {
    const preprintId = ctx.getState().preprint.data?.id;
    if (!preprintId) return;

    ctx.setState(patch({ preprintReviewActions: patch({ isLoading: true }) }));

    return this.preprintsService.getPreprintReviewActions(preprintId).pipe(
      tap((actions) => {
        ctx.setState(
          patch({
            preprintReviewActions: patch({
              isLoading: false,
              data: actions,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'preprintReviewActions', error))
    );
  }

  @Action(FetchPreprintRequests)
  fetchPreprintRequests(ctx: StateContext<PreprintStateModel>) {
    const preprintId = ctx.getState().preprint.data?.id;
    if (!preprintId) return;

    ctx.setState(patch({ preprintRequests: patch({ isLoading: true }) }));

    return this.preprintsService.getPreprintRequests(preprintId).pipe(
      tap((actions) => {
        ctx.setState(
          patch({
            preprintRequests: patch({
              isLoading: false,
              data: actions,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'preprintRequests', error))
    );
  }

  @Action(FetchPreprintRequestActions)
  fetchPreprintRequestsActions(ctx: StateContext<PreprintStateModel>, action: FetchPreprintRequestActions) {
    ctx.setState(patch({ preprintRequestsActions: patch({ isLoading: true }) }));

    return this.preprintsService.getPreprintRequestActions(action.requestId).pipe(
      tap((actions) => {
        ctx.setState(
          patch({
            preprintRequestsActions: patch({
              isLoading: false,
              data: append(actions),
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'preprintRequestsActions', error))
    );
  }

  @Action(WithdrawPreprint)
  withdrawPreprint(ctx: StateContext<PreprintStateModel>, action: WithdrawPreprint) {
    const preprintId = ctx.getState().preprint.data?.id;
    if (!preprintId) return;

    return this.preprintsService.withdrawPreprint(preprintId, action.justification);
  }

  @Action(SubmitReviewsDecision)
  submitReviewsDecision(ctx: StateContext<PreprintStateModel>, action: SubmitReviewsDecision) {
    const preprintId = ctx.getState().preprint.data?.id;
    if (!preprintId) return;

    return this.preprintsService.submitReviewsDecision(preprintId, action.trigger, action.comment);
  }

  @Action(SubmitRequestsDecision)
  submitRequestsDecision(ctx: StateContext<PreprintStateModel>, action: SubmitRequestsDecision) {
    const preprintId = ctx.getState().preprint.data?.id;
    if (!preprintId) return;

    return this.preprintsService.submitRequestsDecision(action.requestId, action.trigger, action.comment);
  }

  @Action(ResetState)
  resetState(ctx: StateContext<PreprintStateModel>) {
    ctx.setState(patch({ ...DefaultState }));
  }
}
