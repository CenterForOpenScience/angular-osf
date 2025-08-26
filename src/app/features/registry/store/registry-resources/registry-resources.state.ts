import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';

import { RegistryResourcesService } from '../../services';

import {
  AddRegistryResource,
  ConfirmAddRegistryResource,
  DeleteResource,
  GetRegistryResources,
  PreviewRegistryResource,
  SilentDelete,
  UpdateResource,
} from './registry-resources.actions';
import { REGISTRY_RESOURCES_STATE_DEFAULTS, RegistryResourcesStateModel } from './registry-resources.model';

@Injectable()
@State<RegistryResourcesStateModel>({
  name: 'registryResources',
  defaults: REGISTRY_RESOURCES_STATE_DEFAULTS,
})
export class RegistryResourcesState {
  private readonly registryResourcesService = inject(RegistryResourcesService);

  @Action(GetRegistryResources)
  getRegistryResources(ctx: StateContext<RegistryResourcesStateModel>, action: GetRegistryResources) {
    const state = ctx.getState();
    ctx.patchState({
      resources: {
        ...state.resources,
        isLoading: true,
      },
    });

    return this.registryResourcesService.getResources(action.registryId).pipe(
      tap((resources) => {
        ctx.patchState({
          resources: {
            data: resources,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((err) => handleSectionError(ctx, 'resources', err))
    );
  }

  @Action(AddRegistryResource)
  addRegistryResource(ctx: StateContext<RegistryResourcesStateModel>, action: AddRegistryResource) {
    const state = ctx.getState();
    ctx.patchState({
      currentResource: {
        ...state.currentResource,
        isSubmitting: true,
      },
    });

    return this.registryResourcesService.addRegistryResource(action.registryId).pipe(
      tap((resource) => {
        ctx.patchState({
          currentResource: {
            data: resource,
            isSubmitting: false,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((err) => handleSectionError(ctx, 'currentResource', err))
    );
  }

  @Action(PreviewRegistryResource)
  previewRegistryResource(ctx: StateContext<RegistryResourcesStateModel>, action: PreviewRegistryResource) {
    const state = ctx.getState();
    ctx.patchState({
      currentResource: {
        ...state.currentResource,
        isLoading: true,
      },
    });

    return this.registryResourcesService.previewRegistryResource(action.resourceId, action.resource).pipe(
      tap((resource) => {
        ctx.patchState({
          currentResource: {
            data: resource,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((err) => handleSectionError(ctx, 'resources', err))
    );
  }

  @Action(ConfirmAddRegistryResource)
  confirmAddRegistryResource(ctx: StateContext<RegistryResourcesStateModel>, action: ConfirmAddRegistryResource) {
    return this.registryResourcesService.confirmAddingResource(action.resourceId, action.resource).pipe(
      tap(() => {
        ctx.dispatch(new GetRegistryResources(action.registryId));
      }),
      catchError((err) => handleSectionError(ctx, 'resources', err))
    );
  }

  @Action(DeleteResource)
  deleteResource(ctx: StateContext<RegistryResourcesStateModel>, action: DeleteResource) {
    const state = ctx.getState();
    ctx.patchState({
      resources: {
        ...state.resources,
        isLoading: true,
      },
    });

    return this.registryResourcesService.deleteResource(action.resourceId).pipe(
      tap(() => {
        ctx.dispatch(new GetRegistryResources(action.registryId));
      }),
      catchError((err) => handleSectionError(ctx, 'resources', err))
    );
  }

  @Action(SilentDelete)
  silentDelete(ctx: StateContext<RegistryResourcesStateModel>, action: SilentDelete) {
    return this.registryResourcesService.deleteResource(action.resourceId);
  }

  @Action(UpdateResource)
  updateResource(ctx: StateContext<RegistryResourcesStateModel>, action: UpdateResource) {
    const state = ctx.getState();
    ctx.patchState({
      currentResource: {
        ...state.currentResource,
        isLoading: true,
      },
    });

    return this.registryResourcesService.updateResource(action.resourceId, action.resource).pipe(
      tap(() => {
        ctx.patchState({
          currentResource: {
            ...state.currentResource,
            isLoading: false,
          },
        });
        ctx.dispatch(new GetRegistryResources(action.registryId));
      }),
      catchError((err) => handleSectionError(ctx, 'resources', err))
    );
  }
}
