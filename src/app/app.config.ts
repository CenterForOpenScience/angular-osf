import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  PLATFORM_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { STATES } from '@core/constants';
import { APPLICATION_INITIALIZATION_PROVIDER } from '@core/factory/application.initialization.factory';
import { WINDOW, windowFactory } from '@core/factory/window.factory';
import { provideTranslation } from '@core/helpers';

import { authInterceptor, errorInterceptor, viewOnlyInterceptor } from './core/interceptors';
import CustomPreset from './core/theme/custom-preset';
import { routes } from './app.routes';

import * as Sentry from '@sentry/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(STATES, withNgxsReduxDevtoolsPlugin({ disabled: false })),
    providePrimeNG({
      theme: {
        preset: CustomPreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'reset, base, primeng',
          },
        },
      },
    }),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, viewOnlyInterceptor, errorInterceptor])),
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    ConfirmationService,
    MessageService,

    APPLICATION_INITIALIZATION_PROVIDER,
    {
      provide: ErrorHandler,
      useFactory: () => Sentry.createErrorHandler({ showDialog: false }),
    },
    {
      provide: WINDOW,
      useFactory: windowFactory,
      deps: [PLATFORM_ID],
    },
  ],
};
