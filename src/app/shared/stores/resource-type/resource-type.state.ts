import { Action, State, StateContext } from '@ngxs/store';

import { catchError, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourceTypeService } from '@osf/shared/services/resource-type.service';

import { ClearResourceType, GetResourceType, SetResourceType } from './resource-type.actions';
import { RESOURCE_TYPE_DEFAULTS, ResourceTypeStateModel } from './resource-type.model';

@State<ResourceTypeStateModel>({
  name: 'resourceType',
  defaults: RESOURCE_TYPE_DEFAULTS,
})
@Injectable()
export class ResourceTypeState {
  private resourceTypeService = inject(ResourceTypeService);

  @Action(SetResourceType)
  setResourceType(ctx: StateContext<ResourceTypeStateModel>, action: SetResourceType) {
    ctx.patchState({
      currentResourceType: {
        data: action.resourceType,
        isLoading: false,
        error: null,
      },
      currentResourceId: action.resourceId,
    });
  }

  @Action(GetResourceType)
  getResourceType(ctx: StateContext<ResourceTypeStateModel>, action: GetResourceType) {
    const state = ctx.getState();

    if (state.currentResourceId === action.resourceId && state.currentResourceType.data) {
      return;
    }

    ctx.patchState({
      currentResourceType: {
        ...state.currentResourceType,
        isLoading: true,
        error: null,
      },
      currentResourceId: action.resourceId,
    });

    return this.resourceTypeService.getResourceType(action.resourceId).pipe(
      tap((resourceType) => {
        ctx.patchState({
          currentResourceType: {
            data: resourceType,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => {
        ctx.patchState({
          currentResourceType: {
            data: null,
            isLoading: false,
            error,
          },
        });
        return of(null);
      })
    );
  }

  @Action(ClearResourceType)
  clearResourceType(ctx: StateContext<ResourceTypeStateModel>) {
    ctx.setState(RESOURCE_TYPE_DEFAULTS);
  }
}
