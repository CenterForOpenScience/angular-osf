import { Action, State, StateContext } from '@ngxs/store';

import { catchError, switchMap, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { AddonsService } from '@shared/services';

import {
  ClearConfiguredAddons,
  ClearOperationInvocations,
  CreateAddonOperationInvocation,
  CreateAuthorizedAddon,
  CreateConfiguredAddon,
  DeleteAuthorizedAddon,
  DeleteConfiguredAddon,
  GetAddonsResourceReference,
  GetAddonsUserReference,
  GetAuthorizedCitationAddons,
  GetAuthorizedStorageAddons,
  GetCitationAddons,
  GetConfiguredCitationAddons,
  GetConfiguredStorageAddons,
  GetStorageAddons,
  UpdateAuthorizedAddon,
  UpdateConfiguredAddon,
} from './addons.actions';
import { AddonsStateModel } from './addons.models';

const ADDONS_DEFAULTS: AddonsStateModel = {
  storageAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  citationAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  authorizedStorageAddons: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  authorizedCitationAddons: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  configuredStorageAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  configuredCitationAddons: {
    data: [],
    isLoading: false,
    error: null,
  },
  addonsUserReference: {
    data: [],
    isLoading: false,
    error: null,
  },
  addonsResourceReference: {
    data: [],
    isLoading: false,
    error: null,
  },
  createdUpdatedAuthorizedAddon: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  createdUpdatedConfiguredAddon: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  operationInvocation: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  selectedFolderOperationInvocation: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};

@State<AddonsStateModel>({
  name: 'addons',
  defaults: ADDONS_DEFAULTS,
})
@Injectable()
export class AddonsState {
  addonsService = inject(AddonsService);

  @Action(GetStorageAddons)
  getStorageAddons(ctx: StateContext<AddonsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      storageAddons: {
        ...state.storageAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAddons('storage').pipe(
      tap((addons) => {
        ctx.patchState({
          storageAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'storageAddons', error))
    );
  }

  @Action(GetCitationAddons)
  getCitationAddons(ctx: StateContext<AddonsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      citationAddons: {
        ...state.citationAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAddons('citation').pipe(
      tap((addons) => {
        ctx.patchState({
          citationAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'citationAddons', error))
    );
  }

  @Action(GetAuthorizedStorageAddons)
  getAuthorizedStorageAddons(ctx: StateContext<AddonsStateModel>, action: GetAuthorizedStorageAddons) {
    const state = ctx.getState();
    ctx.patchState({
      authorizedStorageAddons: {
        ...state.authorizedStorageAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAuthorizedAddons('storage', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          authorizedStorageAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'authorizedStorageAddons', error))
    );
  }

  @Action(GetAuthorizedCitationAddons)
  getAuthorizedCitationAddons(ctx: StateContext<AddonsStateModel>, action: GetAuthorizedCitationAddons) {
    const state = ctx.getState();
    ctx.patchState({
      authorizedCitationAddons: {
        ...state.authorizedCitationAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAuthorizedAddons('citation', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          authorizedCitationAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'authorizedCitationAddons', error))
    );
  }

  @Action(GetConfiguredStorageAddons)
  getConfiguredStorageAddons(ctx: StateContext<AddonsStateModel>, action: GetConfiguredStorageAddons) {
    const state = ctx.getState();
    ctx.patchState({
      configuredStorageAddons: {
        ...state.configuredStorageAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getConfiguredAddons('storage', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          configuredStorageAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'configuredStorageAddons', error))
    );
  }

  @Action(GetConfiguredCitationAddons)
  getConfiguredCitationAddons(ctx: StateContext<AddonsStateModel>, action: GetConfiguredCitationAddons) {
    const state = ctx.getState();
    ctx.patchState({
      configuredCitationAddons: {
        ...state.configuredCitationAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getConfiguredAddons('citation', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          configuredCitationAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'configuredCitationAddons', error))
    );
  }

  @Action(CreateAuthorizedAddon)
  createAuthorizedAddon(ctx: StateContext<AddonsStateModel>, action: CreateAuthorizedAddon) {
    const state = ctx.getState();
    ctx.patchState({
      createdUpdatedAuthorizedAddon: {
        ...state.createdUpdatedAuthorizedAddon,
        isSubmitting: true,
      },
    });

    return this.addonsService.createAuthorizedAddon(action.payload, action.addonType).pipe(
      tap((addon) => {
        ctx.patchState({
          createdUpdatedAuthorizedAddon: {
            data: addon,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
        const referenceId = state.addonsUserReference.data[0]?.id;
        if (referenceId) {
          ctx.dispatch(
            action.addonType === 'storage'
              ? new GetAuthorizedStorageAddons(referenceId)
              : new GetAuthorizedCitationAddons(referenceId)
          );
        }
      }),
      catchError((error) => this.handleError(ctx, 'createdUpdatedAuthorizedAddon', error))
    );
  }

  @Action(UpdateAuthorizedAddon)
  updateAuthorizedAddon(ctx: StateContext<AddonsStateModel>, action: UpdateAuthorizedAddon) {
    const state = ctx.getState();
    ctx.patchState({
      createdUpdatedAuthorizedAddon: {
        ...state.createdUpdatedAuthorizedAddon,
        isSubmitting: true,
      },
    });

    return this.addonsService.updateAuthorizedAddon(action.payload, action.addonType, action.addonId).pipe(
      tap((addon) => {
        ctx.patchState({
          createdUpdatedAuthorizedAddon: {
            data: addon,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
        const referenceId = state.addonsUserReference.data[0]?.id;
        if (referenceId) {
          ctx.dispatch(
            action.addonType === 'storage'
              ? new GetAuthorizedStorageAddons(referenceId)
              : new GetAuthorizedCitationAddons(referenceId)
          );
        }
      }),
      catchError((error) => this.handleError(ctx, 'createdUpdatedAuthorizedAddon', error))
    );
  }

  @Action(CreateConfiguredAddon)
  createConfiguredAddon(ctx: StateContext<AddonsStateModel>, action: CreateConfiguredAddon) {
    const state = ctx.getState();
    ctx.patchState({
      createdUpdatedConfiguredAddon: {
        ...state.createdUpdatedConfiguredAddon,
        isSubmitting: true,
      },
    });

    return this.addonsService.createConfiguredAddon(action.payload, action.addonType).pipe(
      tap((addon) => {
        ctx.patchState({
          createdUpdatedConfiguredAddon: {
            data: addon,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'createdUpdatedConfiguredAddon', error))
    );
  }

  @Action(GetAddonsUserReference)
  getAddonsUserReference(ctx: StateContext<AddonsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      addonsUserReference: {
        ...state.addonsUserReference,
        isLoading: true,
      },
    });

    return this.addonsService.getAddonsUserReference().pipe(
      tap((userReference) => {
        ctx.patchState({
          addonsUserReference: {
            data: userReference,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'addonsUserReference', error))
    );
  }

  @Action(UpdateConfiguredAddon)
  updateConfiguredAddon(ctx: StateContext<AddonsStateModel>, action: UpdateConfiguredAddon) {
    const state = ctx.getState();
    ctx.patchState({
      createdUpdatedConfiguredAddon: {
        ...state.createdUpdatedConfiguredAddon,
        isSubmitting: true,
      },
    });

    return this.addonsService.updateConfiguredAddon(action.payload, action.addonType, action.addonId).pipe(
      tap((addon) => {
        ctx.patchState({
          createdUpdatedConfiguredAddon: {
            data: addon,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
          selectedFolderOperationInvocation: {
            data: null,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
        const referenceId = state.addonsResourceReference.data[0]?.id;
        if (referenceId) {
          ctx.dispatch(
            action.addonType === 'storage'
              ? new GetConfiguredStorageAddons(referenceId)
              : new GetConfiguredCitationAddons(referenceId)
          );
        }
      }),
      catchError((error) => this.handleError(ctx, 'createdUpdatedAuthorizedAddon', error))
    );
  }

  @Action(GetAddonsResourceReference)
  getAddonsResourceReference(ctx: StateContext<AddonsStateModel>, action: GetAddonsResourceReference) {
    const state = ctx.getState();
    ctx.patchState({
      addonsResourceReference: {
        ...state.addonsResourceReference,
        isLoading: true,
      },
    });

    return this.addonsService.getAddonsResourceReference(action.resourceId).pipe(
      tap((resourceReference) => {
        ctx.patchState({
          addonsResourceReference: {
            data: resourceReference,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => this.handleError(ctx, 'addonsResourceReference', error))
    );
  }

  @Action(DeleteAuthorizedAddon)
  deleteAuthorizedAddon(ctx: StateContext<AddonsStateModel>, action: DeleteAuthorizedAddon) {
    const state = ctx.getState();
    const stateKey = action.addonType === 'storage' ? 'authorizedStorageAddons' : 'authorizedCitationAddons';
    ctx.patchState({
      [stateKey]: {
        ...state[stateKey],
        isSubmitting: true,
      },
    });

    return this.addonsService.deleteAuthorizedAddon(action.id, action.addonType).pipe(
      switchMap(() => {
        const referenceId = state.addonsUserReference.data[0]?.id;
        if (referenceId) {
          return action.addonType === 'storage'
            ? ctx.dispatch(new GetAuthorizedStorageAddons(referenceId))
            : ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
        }
        return [];
      }),
      catchError((error) => this.handleError(ctx, stateKey, error))
    );
  }

  @Action(DeleteConfiguredAddon)
  deleteConfiguredAddon(ctx: StateContext<AddonsStateModel>, action: DeleteConfiguredAddon) {
    const state = ctx.getState();

    ctx.patchState({
      createdUpdatedConfiguredAddon: {
        ...state.createdUpdatedConfiguredAddon,
        isSubmitting: true,
      },
    });

    return this.addonsService.deleteConfiguredAddon(action.id, action.addonType).pipe(
      switchMap(() => {
        ctx.patchState({
          createdUpdatedConfiguredAddon: {
            ...state.createdUpdatedConfiguredAddon,
            isSubmitting: false,
          },
        });
        const referenceId = state.addonsResourceReference.data[0]?.id;
        if (referenceId) {
          return action.addonType === 'configured-storage-addons'
            ? ctx.dispatch(new GetConfiguredStorageAddons(referenceId))
            : ctx.dispatch(new GetConfiguredCitationAddons(referenceId));
        }
        return [];
      }),
      catchError((error) => this.handleError(ctx, 'createdUpdatedConfiguredAddon', error))
    );
  }

  @Action(CreateAddonOperationInvocation)
  createAddonOperationInvocation(ctx: StateContext<AddonsStateModel>, action: CreateAddonOperationInvocation) {
    const state = ctx.getState();
    ctx.patchState({
      operationInvocation: {
        ...state.operationInvocation,
        isSubmitting: true,
      },
    });

    return this.addonsService.createAddonOperationInvocation(action.payload).pipe(
      tap((response) => {
        ctx.patchState({
          operationInvocation: {
            data: response,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });

        if (response.operationName === 'get_item_info' && response.operationResult[0]?.itemName) {
          ctx.patchState({
            selectedFolderOperationInvocation: {
              data: response,
              isLoading: false,
              isSubmitting: false,
              error: null,
            },
          });
        }
      }),
      catchError((error) => this.handleError(ctx, 'operationInvocation', error))
    );
  }

  @Action(ClearConfiguredAddons)
  clearConfiguredAddons(ctx: StateContext<AddonsStateModel>) {
    ctx.patchState({
      configuredStorageAddons: {
        data: [],
        isLoading: false,
        error: null,
      },
      configuredCitationAddons: {
        data: [],
        isLoading: false,
        error: null,
      },
      addonsResourceReference: {
        data: [],
        isLoading: false,
        error: null,
      },
    });
  }

  @Action(ClearOperationInvocations)
  clearOperationInvocations(ctx: StateContext<AddonsStateModel>) {
    ctx.patchState({
      operationInvocation: {
        data: null,
        isLoading: false,
        error: null,
      },
      selectedFolderOperationInvocation: {
        data: null,
        isLoading: false,
        error: null,
      },
    });
  }

  private handleError(ctx: StateContext<AddonsStateModel>, section: keyof AddonsStateModel, error: Error) {
    ctx.patchState({
      [section]: {
        ...ctx.getState()[section],
        isLoading: false,
        isSubmitting: false,
        error: error.message,
      },
    });
    return throwError(() => error);
  }
}
