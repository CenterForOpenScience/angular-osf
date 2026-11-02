import { Observable } from 'rxjs';

import { DestroyRef } from '@angular/core';

import { CurrentResourceType } from '../enums/resource-type.enum';

export interface ConfirmForkOptions {
  resourceType: CurrentResourceType;
  destroyRef: DestroyRef;
  fork: () => Observable<unknown>;
  onSuccess?: () => void;
}
