import { InjectionToken } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AppEnvironment } from '@shared/models/environment.model';

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('App Environment', {
  providedIn: 'root',
  factory: () => environment as AppEnvironment,
});
