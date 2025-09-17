import { InjectionToken } from '@angular/core';

import { AppEnvironment } from '@shared/models/environment.model';

import { environment } from 'src/environments/environment';

export const ENVIRONMENT = new InjectionToken<AppEnvironment>('App Environment', {
  providedIn: 'root',
  factory: () => environment as AppEnvironment,
});
