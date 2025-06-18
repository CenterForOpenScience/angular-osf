import { OperationNames } from '@osf/features/project/addons/enums';

export interface OperationInvokeData {
  operationName: OperationNames;
  itemId: string;
}
