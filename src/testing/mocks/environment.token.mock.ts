import { ENVIRONMENT } from '@core/constants/environment.token';

export const EnvironmentTokenMock = {
  provide: ENVIRONMENT,
  useValue: {
    production: false,
    google: {
      GOOGLE_FILE_PICKER_API_KEY: 'test-api-key',
      GOOGLE_FILE_PICKER_APP_ID: 'test-app-id',
    },
  },
};
