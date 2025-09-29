import { StorageItem } from '@shared/models';

export interface OperationInvocation {
  id: string;
  type: string;
  invocationStatus: string;
  operationName: string;
  operationKwargs: {
    itemId?: string;
    itemType?: string;
  };
  operationResult: StorageItem[];
  itemCount: number;
}
