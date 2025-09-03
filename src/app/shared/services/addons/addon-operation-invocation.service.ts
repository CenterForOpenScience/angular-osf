import { Injectable } from '@angular/core';

import { OperationNames } from '@osf/features/project/addons/enums';
import { AuthorizedAccountModel, ConfiguredStorageAddonModel, OperationInvocationRequestJsonApi } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class AddonOperationInvocationService {
  createInitialOperationInvocationPayload(
    operationName: OperationNames,
    selectedAccount: AuthorizedAccountModel,
    itemId?: string
  ): OperationInvocationRequestJsonApi {
    const operationKwargs = this.getOperationKwargs(operationName, itemId);

    return {
      data: {
        type: 'addon-operation-invocations',
        attributes: {
          invocation_status: null,
          operation_name: operationName,
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
    addon: ConfiguredStorageAddonModel,
    operationName: OperationNames,
    itemId: string
  ): OperationInvocationRequestJsonApi {
    const operationKwargs = this.getOperationKwargs(operationName, itemId);

    return {
      data: {
        type: 'addon-operation-invocations',
        attributes: {
          invocation_status: null,
          operation_name: operationName,
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
    if (!itemId || operationName === OperationNames.LIST_ROOT_ITEMS) {
      return {};
    }

    return {
      item_id: itemId,
      ...(operationName === OperationNames.LIST_CHILD_ITEMS && { item_type: 'FOLDER' }),
    };
  }
}
