import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { STATES } from '@core/constants/ngxs-states.constant';
import { provideTranslation } from '@core/helpers/i18n.helper';

import { routes } from './app.routes';

import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(STATES, withNgxsReduxDevtoolsPlugin({ disabled: false })),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'base, primeng, reset',
          },
        },
      },
    }),
    provideAnimations(),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000',
    }),
    ConfirmationService,
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
  ],
};
