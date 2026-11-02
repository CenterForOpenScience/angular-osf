import { MockProvider } from 'ng-mocks';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { EnvironmentModel } from '@osf/shared/models/environment.model';

export const MOCK_API_DOMAIN_URL = 'https://api.test';
export const MOCK_API_URL = `${MOCK_API_DOMAIN_URL}/v2`;

export function provideMockEnvironment(overrides: Partial<EnvironmentModel> = {}) {
  return MockProvider(ENVIRONMENT, {
    apiDomainUrl: MOCK_API_DOMAIN_URL,
    ...overrides,
  });
}
