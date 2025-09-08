import { Action, State, StateContext } from '@ngxs/store';

import { catchError, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { AuthorizedAccountModel } from '@osf/shared/models';
import { AddonsService } from '@osf/shared/services';

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
  GetAuthorizedStorageOauthToken,
  GetCitationAddons,
  GetConfiguredCitationAddons,
  GetConfiguredStorageAddons,
  GetStorageAddons,
  UpdateAuthorizedAddon,
  UpdateConfiguredAddon,
} from './addons.actions';
import { ADDONS_DEFAULTS, AddonsStateModel } from './addons.models';

/**
 * NGXS state class for managing addon-related data and actions.
 *
 * Handles loading and storing both storage and citation addons as well as their configurations.
 * This state includes logic for retrieving addons, patching loading states, handling errors,
 * and providing selectors for access within the application.
 *
 * @see AddonsStateModel
 * @see ADDONS_DEFAULTS
 * @see addons.actions.ts
 * @see addons.selectors.ts
 */
@State<AddonsStateModel>({
  name: 'addons',
  defaults: ADDONS_DEFAULTS,
})
@Injectable()
export class AddonsState {
  /**
   * Injected instance of {@link AddonsService}, used to interact with the addons API.
   *
   * Provides methods for retrieving and mapping addon configurations, including
   * storage and citation addon types.
   *
   * @see AddonsService
   */
  addonsService = inject(AddonsService);

  /**
   * NGXS action handler for retrieving the list of storage addons.
   *
   * Dispatching this action sets the `storageAddons` slice of state into a loading state,
   * then asynchronously fetches storage addon configurations from the `AddonsService`.
   *
   * On success:
   * - The retrieved addon list is stored in `storageAddons.data`.
   * - `isLoading` is set to `false` and `error` is cleared.
   *
   * On failure:
   * - Invokes `handleError` to populate the `error` state and stop the loading flag.
   *
   * @param ctx - NGXS `StateContext` instance for `AddonsStateModel`.
   * Used to read and mutate the application state.
   *
   * @returns An observable that completes once the addon data has been loaded or the error is handled.
   *
   * @example
   * this.store.dispatch(new GetStorageAddons());
   */
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
      catchError((error) => handleSectionError(ctx, 'storageAddons', error))
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
      catchError((error) => handleSectionError(ctx, 'citationAddons', error))
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

    return this.addonsService.getAuthorizedStorageAddons('storage', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          authorizedStorageAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'authorizedStorageAddons', error))
    );
  }

  @Action(GetAuthorizedStorageOauthToken)
  getAuthorizedStorageOauthToken(ctx: StateContext<AddonsStateModel>, action: GetAuthorizedStorageOauthToken) {
    const state = ctx.getState();
    ctx.patchState({
      authorizedStorageAddons: {
        ...state.authorizedStorageAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAuthorizedStorageOauthToken(action.accountId).pipe(
      tap((addon) => {
        ctx.setState((state) => {
          const existing = state.authorizedStorageAddons.data.find(
            (existingAddon: AuthorizedAccountModel) => existingAddon.id === addon.id
          );
          const updatedData = existing
            ? state.authorizedStorageAddons.data.map((existingAddon: AuthorizedAccountModel) =>
                existingAddon.id === addon.id ? { ...existingAddon, ...addon } : existingAddon
              )
            : [...state.authorizedStorageAddons.data, addon];

          return {
            ...state,
            authorizedStorageAddons: {
              ...state.authorizedStorageAddons,
              data: updatedData,
              isLoading: false,
              error: null,
            },
          };
        });
      }),
      catchError((error) => handleSectionError(ctx, 'authorizedStorageAddons', error))
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

    return this.addonsService.getAuthorizedStorageAddons('citation', action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          authorizedCitationAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'authorizedCitationAddons', error))
    );
  }

  /**
   * Handles the NGXS action `GetConfiguredStorageAddons`.
   *
   * This method is responsible for retrieving a list of configured storage addons
   * associated with a specific `referenceId` (e.g., a node or registration).
   *
   * It sets the loading state before initiating the request and patches the store
   * with the resulting data or error upon completion.
   *
   * @param ctx - The NGXS `StateContext` used to read and mutate the `AddonsStateModel`.
   * @param action - The dispatched `GetConfiguredStorageAddons` action, which contains the `referenceId` used to fetch data.
   * @returns An `Observable` that emits when the addons are successfully fetched or an error is handled.
   *
   * @example
   * store.dispatch(new GetConfiguredStorageAddons('abc123'));
   */
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
      catchError((error) => handleSectionError(ctx, 'configuredStorageAddons', error))
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
      catchError((error) => handleSectionError(ctx, 'configuredCitationAddons', error))
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
      catchError((error) => handleSectionError(ctx, 'createdUpdatedAuthorizedAddon', error))
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
      catchError((error) => handleSectionError(ctx, 'createdUpdatedAuthorizedAddon', error))
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
      catchError((error) => handleSectionError(ctx, 'createdUpdatedConfiguredAddon', error))
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
      catchError((error) => handleSectionError(ctx, 'addonsUserReference', error))
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
      catchError((error) => handleSectionError(ctx, 'createdUpdatedAuthorizedAddon', error))
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
      catchError((error) => handleSectionError(ctx, 'addonsResourceReference', error))
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
      catchError((error) => handleSectionError(ctx, stateKey, error))
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
      catchError((error) => handleSectionError(ctx, 'createdUpdatedConfiguredAddon', error))
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
      catchError((error) => handleSectionError(ctx, 'operationInvocation', error))
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
}
