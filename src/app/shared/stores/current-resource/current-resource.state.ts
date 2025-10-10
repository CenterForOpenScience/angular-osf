import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { ResourceGuidService } from '@osf/shared/services';

import { GetResource, GetResourceDetails, GetResourceWithChildren } from './current-resource.actions';
import { CURRENT_RESOURCE_DEFAULTS, CurrentResourceStateModel } from './current-resource.model';

@State<CurrentResourceStateModel>({
  name: 'currentResource',
  defaults: CURRENT_RESOURCE_DEFAULTS,
})
@Injectable()
export class CurrentResourceState {
  private resourceService = inject(ResourceGuidService);

  @Action(GetResource)
  getResource(ctx: StateContext<CurrentResourceStateModel>, action: GetResource) {
    const state = ctx.getState();

    if (state.currentResource.data?.id === action.resourceId && !action.refresh) {
      return;
    }

    ctx.patchState({
      currentResource: {
        ...state.currentResource,
        isLoading: true,
        error: null,
      },
    });

    return this.resourceService.getResourceById(action.resourceId).pipe(
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

  @Action(GetResourceDetails)
  getResourceDetails(ctx: StateContext<CurrentResourceStateModel>, action: GetResourceDetails) {
    const state = ctx.getState();

    ctx.patchState({
      resourceDetails: {
        ...state.resourceDetails,
        isLoading: true,
        error: null,
      },
    });

    return this.resourceService.getResourceDetails(action.resourceId, action.resourceType).pipe(
      tap((details) => {
        ctx.patchState({
          resourceDetails: {
            data: details,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'resourceDetails', error))
    );
  }

  @Action(GetResourceWithChildren)
  getResourceWithChildren(ctx: StateContext<CurrentResourceStateModel>, action: GetResourceWithChildren) {
    const state = ctx.getState();

    ctx.patchState({
      resourceChildren: {
        ...state.resourceChildren,
        isLoading: true,
        error: null,
      },
    });

    return this.resourceService
      .getResourceWithChildren(action.rootParentId, action.resourceId, action.resourceType)
      .pipe(
        tap((children) => {
          ctx.patchState({
            resourceChildren: {
              data: children,
              isLoading: false,
              error: null,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'resourceChildren', error))
      );
  }
}
