import { InjectionToken } from '@angular/core';

import { ConfigModel } from '@core/models/config.model';

export const SSR_CONFIG = new InjectionToken<ConfigModel>('SSR_CONFIG');
