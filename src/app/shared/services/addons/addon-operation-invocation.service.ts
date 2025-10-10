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
    itemId?: string,
    pageCursor?: string
  ): OperationInvocationRequestJsonApi {
    const addonSpecificOperationName = this.getAddonSpecificOperationName(operationName, selectedAccount);
    const operationKwargs = this.getOperationKwargs(addonSpecificOperationName, itemId, pageCursor);

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
    itemId: string,
    pageCursor?: string
  ): OperationInvocationRequestJsonApi {
    const addonSpecificOperationName = this.getAddonSpecificOperationName(operationName, addon);
    const operationKwargs = this.getOperationKwargs(addonSpecificOperationName, itemId, pageCursor);

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

  private getOperationKwargs(
    operationName: OperationNames,
    itemId?: string,
    pageCursor?: string
  ): Record<string, unknown> {
    const isRootOperation =
      operationName === OperationNames.LIST_ROOT_ITEMS || operationName === OperationNames.LIST_ROOT_COLLECTIONS;

    const baseKwargs: Record<string, unknown> = {};

    if (itemId && !isRootOperation) {
      baseKwargs['item_id'] = itemId;
    }

    const isChildOperation =
      operationName === OperationNames.LIST_CHILD_ITEMS || operationName === OperationNames.LIST_COLLECTION_ITEMS;

    if (isChildOperation) {
      baseKwargs['item_type'] = 'FOLDER';
    }

    if (pageCursor) {
      baseKwargs['page_cursor'] = pageCursor;
    }

    return baseKwargs;
  }
}
