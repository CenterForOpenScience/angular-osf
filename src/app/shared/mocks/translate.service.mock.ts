import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

export const TranslateServiceMock = MockProvider(TranslateService, {
  instant: (key: string) => key,
  get: (key: string) => of(key),
});
