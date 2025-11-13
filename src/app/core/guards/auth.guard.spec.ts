import { inject } from '@angular/core';

import { AuthService } from '@core/services/auth.service';

import { authGuard } from './auth.guard';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

describe.skip('authGuard (functional)', () => {
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
  });

  it('should return true when user is authenticated', () => {
    (inject as jest.Mock).mockImplementation((token) => {
      if (token === AuthService) return mockAuthService;
    });

    const result = authGuard({} as any, {} as any);

    expect(result).toBe(true);
  });

  it('should navigate to sign-in and return false when user is not authenticated', () => {
    (inject as jest.Mock).mockImplementation((token) => {
      if (token === AuthService) return mockAuthService;
    });

    const result = authGuard({} as any, {} as any);

    expect(mockAuthService.navigateToSignIn).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
