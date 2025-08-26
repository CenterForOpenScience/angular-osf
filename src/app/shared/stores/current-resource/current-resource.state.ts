import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { ResourceGuidService } from '@osf/shared/services';

import { GetResource } from './current-resource.actions';
import { CURRENT_RESOURCE_DEFAULTS, CurrentResourceStateModel } from './current-resource.model';

@State<CurrentResourceStateModel>({
  name: 'currentResource',
  defaults: CURRENT_RESOURCE_DEFAULTS,
})
@Injectable()
export class CurrentResourceState {
  private resourceTypeService = inject(ResourceGuidService);

  @Action(GetResource)
  getResourceType(ctx: StateContext<CurrentResourceStateModel>, action: GetResource) {
    const state = ctx.getState();

    if (state.currentResource.data?.id === action.resourceId) {
      return;
    }

    ctx.patchState({
      currentResource: {
        ...state.currentResource,
        isLoading: true,
        error: null,
      },
    });

    return this.resourceTypeService.getResourceById(action.resourceId).pipe(
      tap((resourceType) => {
        ctx.patchState({
          currentResource: {
            data: resourceType,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'currentResource', error))
    );
  }
}
