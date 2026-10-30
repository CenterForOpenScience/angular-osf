import { DestroyRef } from '@angular/core';

export interface DeleteResourceDialogData {
  listMessageKey: string;
  warningMessageKey: string;
  confirmationKey: string;
  noPermissionsMessageKey: string;
  singleMessageKey?: string;
}

export interface DeleteResourceBaseOptions {
  rootParentId: string;
  resourceId: string;
  destroyRef: DestroyRef;
  onSuccess: () => void;
}

export interface DeleteResourceRunConfig extends DeleteResourceBaseOptions {
  dialogHeader: string;
  toastKey: string;
  dialogData: DeleteResourceDialogData;
}
