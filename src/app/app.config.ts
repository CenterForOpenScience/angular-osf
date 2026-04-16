import { provideStore } from '@ngxs/store';

import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { STATES } from '@core/constants/ngxs-states.constant';
import { provideTranslation } from '@core/helpers/i18n.helper';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { viewOnlyInterceptor } from '@core/interceptors/view-only.interceptor';
import { APPLICATION_INITIALIZATION_PROVIDER } from '@core/provider/application.initialization.provider';
import { SENTRY_PROVIDER } from '@core/provider/sentry.provider';

import CustomPreset from './core/theme/custom-preset';
import { routes } from './app.routes';

import * as Sentry from '@sentry/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    APPLICATION_INITIALIZATION_PROVIDER,
    ConfirmationService,
    DialogService,
    MessageService,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({ showDialog: false }),
    },
    SENTRY_PROVIDER,
    provideTranslation,
    provideClientHydration(withEventReplay()),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    provideHttpClient(withInterceptors([authInterceptor, viewOnlyInterceptor, errorInterceptor]), withFetch()),
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
    provideStore(STATES),
  ],
};
