import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { provideStore } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { STATES } from '@core/constants';
import { APPLICATION_INITIALIZATION_PROVIDER } from '@core/factory/application.initialization.factory';
import { SENTRY_PROVIDER } from '@core/factory/sentry.factory';
import { provideTranslation } from '@core/helpers';

import { authInterceptor, errorInterceptor, viewOnlyInterceptor } from './core/interceptors';
import CustomPreset from './core/theme/custom-preset';
import { routes } from './app.routes';

import * as Sentry from '@sentry/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    APPLICATION_INITIALIZATION_PROVIDER,
    ConfirmationService,
    {
      provide: ErrorHandler,
      useFactory: () => Sentry.createErrorHandler({ showDialog: false }),
    },
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    MessageService,
    provideAnimations(),
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
    provideHttpClient(withInterceptors([authInterceptor, viewOnlyInterceptor, errorInterceptor])),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    provideStore(STATES, withNgxsReduxDevtoolsPlugin({ disabled: false })),
    provideZoneChangeDetection({ eventCoalescing: true }),
    SENTRY_PROVIDER,
  ],
};
