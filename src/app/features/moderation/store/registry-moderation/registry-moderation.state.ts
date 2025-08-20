import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { PaginatedData } from '@osf/shared/models';

import { RegistryModeration } from '../../models';
import { RegistryModerationService } from '../../services';

import { GetRegistrySubmissions } from './registry-moderation.actions';
import { REGISTRY_MODERATION_STATE_DEFAULTS, RegistryModerationStateModel } from './registry-moderation.model';

@State<RegistryModerationStateModel>({
  name: 'registryModeration',
  defaults: REGISTRY_MODERATION_STATE_DEFAULTS,
})
@Injectable()
export class RegistryModerationState {
  private readonly registryModerationService = inject(RegistryModerationService);

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
