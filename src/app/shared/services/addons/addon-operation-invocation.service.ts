import { Injectable } from '@angular/core';

import { OperationNames } from '@osf/shared/enums';
import { isCitationAddon } from '@osf/shared/helpers';
import { AuthorizedAccountModel, ConfiguredAddonModel, OperationInvocationRequestJsonApi } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AddonOperationInvocationService {
  private getAddonSpecificOperationName(
    operationName: OperationNames,
    addon: AuthorizedAccountModel | ConfiguredAddonModel
  ): OperationNames {
    if (!isCitationAddon(addon)) {
      return operationName;
    }

    const operationMap: Record<string, OperationNames> = {
      [OperationNames.LIST_ROOT_ITEMS]: OperationNames.LIST_ROOT_COLLECTIONS,
      [OperationNames.LIST_CHILD_ITEMS]: OperationNames.LIST_COLLECTION_ITEMS,
    };

    return operationMap[operationName] ?? operationName;
  }

  createInitialOperationInvocationPayload(
    operationName: OperationNames,
    selectedAccount: AuthorizedAccountModel,
    itemId?: string
  ): OperationInvocationRequestJsonApi {
    const addonSpecificOperationName = this.getAddonSpecificOperationName(operationName, selectedAccount);
    const operationKwargs = this.getOperationKwargs(addonSpecificOperationName, itemId);

    return {
      data: {
        type: 'addon-operation-invocations',
        attributes: {
          invocation_status: null,
          operation_name: addonSpecificOperationName,
          operation_kwargs: operationKwargs,
          operation_result: {},
          created: null,
          modified: null,
        },
        relationships: {
          thru_account: {
            data: {
              type: selectedAccount.type,
              id: selectedAccount.id,
            },
          },
        },
      },
    };
  }

  createOperationInvocationPayload(
    addon: ConfiguredAddonModel,
    operationName: OperationNames,
    itemId: string
  ): OperationInvocationRequestJsonApi {
    const addonSpecificOperationName = this.getAddonSpecificOperationName(operationName, addon);
    const operationKwargs = this.getOperationKwargs(addonSpecificOperationName, itemId);

    return {
      data: {
        type: 'addon-operation-invocations',
        attributes: {
          invocation_status: null,
          operation_name: addonSpecificOperationName,
          operation_kwargs: operationKwargs,
          operation_result: {},
          created: null,
          modified: null,
        },
        relationships: {
          thru_addon: {
            data: {
              type: addon.type,
              id: addon.id,
            },
          },
        },
      },
    };
  }

  private getOperationKwargs(operationName: OperationNames, itemId?: string): Record<string, unknown> {
    const isRootOperation =
      operationName === OperationNames.LIST_ROOT_ITEMS || operationName === OperationNames.LIST_ROOT_COLLECTIONS;

    if (!itemId || isRootOperation) {
      return {};
    }

    const isChildOperation =
      operationName === OperationNames.LIST_CHILD_ITEMS || operationName === OperationNames.LIST_COLLECTION_ITEMS;

    return {
      item_id: itemId,
      ...(isChildOperation && { item_type: 'FOLDER' }),
    };
  }
}
