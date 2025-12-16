import { Action, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { DEFAULT_TABLE_PARAMS } from '@shared/constants/default-table-params.constants';
import { ResourceType } from '@shared/enums/resource-type.enum';
import { ContributorsService } from '@shared/services/contributors.service';

import { RegistryModeration } from '../../models';
import { RegistryModerationService } from '../../services';

import {
  GetRegistrySubmissionContributors,
  GetRegistrySubmissions,
  LoadMoreRegistrySubmissionContributors,
} from './registry-moderation.actions';
import { REGISTRY_MODERATION_STATE_DEFAULTS, RegistryModerationStateModel } from './registry-moderation.model';

@State<RegistryModerationStateModel>({
  name: 'registryModeration',
  defaults: REGISTRY_MODERATION_STATE_DEFAULTS,
})
@Injectable()
export class RegistryModerationState {
  private readonly registryModerationService = inject(RegistryModerationService);
  private readonly contributorsService = inject(ContributorsService);

  @Action(GetRegistrySubmissionContributors)
  getRegistrySubmissionContributors(
    ctx: StateContext<RegistryModerationStateModel>,
    { registryId, page }: GetRegistrySubmissionContributors
  ) {
    const state = ctx.getState();
    const submission = state.submissions.data.find((s) => s.id === registryId);

    if (submission?.contributors && submission.contributors.length > 0 && page === 1) {
      return;
    }

    ctx.setState(
      patch({
        submissions: patch({
          data: updateItem<RegistryModeration>(
            (submission) => submission.id === registryId,
            patch({ contributorsLoading: true })
          ),
        }),
      })
    );

    return this.contributorsService
      .getBibliographicContributors(ResourceType.Registration, registryId, page, DEFAULT_TABLE_PARAMS.rows)
      .pipe(
        tap((res) => {
          const currentSubmission = state.submissions.data.find((s) => s.id === registryId);
          const existingContributors = currentSubmission?.contributors || [];
          const newContributors = page === 1 ? res.data : [...existingContributors, ...res.data];

          ctx.setState(
            patch({
              submissions: patch({
                data: updateItem<RegistryModeration>(
                  (submission) => submission.id === registryId,
                  patch({
                    contributors: newContributors,
                    totalContributors: res.totalCount,
                    contributorsLoading: false,
                    contributorsPage: page,
                  })
                ),
              }),
            })
          );
        }),
        catchError((error) => {
          ctx.setState(
            patch({
              submissions: patch({
                data: updateItem<RegistryModeration>(
                  (submission) => submission.id === registryId,
                  patch({ contributorsLoading: false })
                ),
              }),
            })
          );

          return handleSectionError(ctx, 'submissions', error);
        })
      );
  }

  @Action(LoadMoreRegistrySubmissionContributors)
  loadMoreRegistrySubmissionContributors(
    ctx: StateContext<RegistryModerationStateModel>,
    { registryId }: LoadMoreRegistrySubmissionContributors
  ) {
    const state = ctx.getState();
    const submission = state.submissions.data.find((s) => s.id === registryId);
    const currentPage = submission?.contributorsPage || 1;
    const nextPage = currentPage + 1;

    return ctx.dispatch(new GetRegistrySubmissionContributors(registryId, nextPage));
  }

  @Action(GetRegistrySubmissions)
  getRegistrySubmissions(
    ctx: StateContext<RegistryModerationStateModel>,
    { provider, status, page, sort }: GetRegistrySubmissions
  ) {
    ctx.setState(patch({ submissions: patch({ isLoading: true }) }));

    return this.registryModerationService.getRegistrySubmissions(provider, status, page, sort).pipe(
      switchMap((res) => {
        if (!res.data.length) {
          return of({
            data: [],
            totalCount: res.totalCount,
          });
        }

        const actionRequests = res.data.map((item) =>
          this.registryModerationService.getRegistrySubmissionHistory(item.id)
        );

        return forkJoin(actionRequests).pipe(
          map(
            (actions) =>
              ({
                data: res.data.map((item, i) => ({ ...item, actions: actions[i] })),
                totalCount: res.totalCount,
              }) as PaginatedData<RegistryModeration[]>
          )
        );
      }),
      tap((res) => {
        ctx.setState(
          patch({
            submissions: patch({
              data: res.data,
              isLoading: false,
              totalCount: res.totalCount,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'submissions', error))
    );
  }
}
