import { Action, State, StateContext } from '@ngxs/store';

import { catchError, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { AddonType } from '@osf/shared/enums';
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
  GetAuthorizedLinkAddons,
  GetAuthorizedStorageAddons,
  GetAuthorizedStorageOauthToken,
  GetCitationAddons,
  GetConfiguredCitationAddons,
  GetConfiguredLinkAddons,
  GetConfiguredStorageAddons,
  GetLinkAddons,
  GetStorageAddons,
  UpdateAuthorizedAddon,
  UpdateConfiguredAddon,
} from './addons.actions';
import { ADDONS_DEFAULTS, AddonsStateModel } from './addons.models';

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

    return this.addonsService.getAddons(AddonType.STORAGE).pipe(
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

    return this.addonsService.getAddons(AddonType.CITATION).pipe(
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

  @Action(GetLinkAddons)
  getLinkedAddons(ctx: StateContext<AddonsStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      linkAddons: {
        ...state.linkAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAddons(AddonType.LINK).pipe(
      tap((addons) => {
        ctx.patchState({
          linkAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'linkAddons', error))
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

    return this.addonsService.getAuthorizedAddons(AddonType.STORAGE, action.referenceId).pipe(
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

    return this.addonsService.getAuthorizedAddons(AddonType.CITATION, action.referenceId).pipe(
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

  @Action(GetAuthorizedLinkAddons)
  getAuthorizedLinkAddons(ctx: StateContext<AddonsStateModel>, action: GetAuthorizedLinkAddons) {
    const state = ctx.getState();
    ctx.patchState({
      authorizedLinkAddons: {
        ...state.authorizedLinkAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getAuthorizedAddons(AddonType.LINK, action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          authorizedLinkAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'authorizedLinkAddons', error))
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

    return this.addonsService.getConfiguredAddons(AddonType.STORAGE, action.referenceId).pipe(
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

    return this.addonsService.getConfiguredAddons(AddonType.CITATION, action.referenceId).pipe(
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

  @Action(GetConfiguredLinkAddons)
  getConfiguredLinkAddons(ctx: StateContext<AddonsStateModel>, action: GetConfiguredLinkAddons) {
    const state = ctx.getState();
    ctx.patchState({
      configuredLinkAddons: {
        ...state.configuredLinkAddons,
        isLoading: true,
      },
    });

    return this.addonsService.getConfiguredAddons(AddonType.LINK, action.referenceId).pipe(
      tap((addons) => {
        ctx.patchState({
          configuredLinkAddons: {
            data: addons,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'configuredLinkAddons', error))
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
          if (action.addonType === AddonType.STORAGE) {
            ctx.dispatch(new GetAuthorizedStorageAddons(referenceId));
          } else if (action.addonType === AddonType.CITATION) {
            ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
          } else if (action.addonType === AddonType.LINK) {
            ctx.dispatch(new GetAuthorizedLinkAddons(referenceId));
          }
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
          if (action.addonType === AddonType.STORAGE) {
            ctx.dispatch(new GetAuthorizedStorageAddons(referenceId));
          } else if (action.addonType === AddonType.CITATION) {
            ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
          } else if (action.addonType === AddonType.LINK) {
            ctx.dispatch(new GetAuthorizedLinkAddons(referenceId));
          }
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
          selectedItemOperationInvocation: {
            data: null,
            isLoading: false,
            isSubmitting: false,
            error: null,
          },
        });
        const referenceId = state.addonsResourceReference.data[0]?.id;
        if (referenceId) {
          ctx.dispatch(
            action.addonType === AddonType.STORAGE
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
    const stateKey =
      action.addonType === AddonType.STORAGE
        ? 'authorizedStorageAddons'
        : action.addonType === AddonType.CITATION
          ? 'authorizedCitationAddons'
          : 'authorizedLinkAddons';
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
          if (action.addonType === AddonType.STORAGE) {
            return ctx.dispatch(new GetAuthorizedStorageAddons(referenceId));
          } else if (action.addonType === AddonType.CITATION) {
            return ctx.dispatch(new GetAuthorizedCitationAddons(referenceId));
          } else if (action.addonType === AddonType.LINK) {
            return ctx.dispatch(new GetAuthorizedLinkAddons(referenceId));
          }
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
          if (action.addonType === AddonType.STORAGE) {
            ctx.dispatch(new GetConfiguredStorageAddons(referenceId));
          } else if (action.addonType === AddonType.CITATION) {
            ctx.dispatch(new GetConfiguredCitationAddons(referenceId));
          } else if (action.addonType === AddonType.LINK) {
            ctx.dispatch(new GetConfiguredLinkAddons(referenceId));
          }
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
            selectedItemOperationInvocation: {
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
      selectedItemOperationInvocation: {
        data: null,
        isLoading: false,
        error: null,
      },
    });
  }
}
