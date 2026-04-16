import { of } from 'rxjs';

import { Mock } from 'vitest';

import { AuthService } from '@core/services/auth.service';

export type AuthServiceMockType = Partial<AuthService> & {
  apiUrl: string;
  webUrl: string;
  casUrl: string;
  navigateToSignIn: Mock;
  navigateToOrcidSignIn: Mock;
  navigateToInstitutionSignIn: Mock;
  logout: Mock;
  register: Mock;
  forgotPassword: Mock;
  resetPassword: Mock;
};

export const AuthServiceMock = {
  simple(): AuthServiceMockType {
    return {
      apiUrl: 'https://api.test/v2/users/',
      webUrl: 'https://web.test',
      casUrl: 'https://cas.test',
      navigateToSignIn: vi.fn(),
      navigateToOrcidSignIn: vi.fn(),
      navigateToInstitutionSignIn: vi.fn(),
      logout: vi.fn(),
      register: vi.fn().mockReturnValue(of({})),
      forgotPassword: vi.fn().mockReturnValue(of({})),
      resetPassword: vi.fn().mockReturnValue(of({})),
    };
  },
};
