import { inject } from '@angular/core';

import { AuthService } from '@osf/features/auth/services';

import { NavigationService } from '../services/navigation.service';

import { authGuard } from './auth.guard';

// Mock dependencies
jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  inject: jest.fn(),
}));

describe('authGuard (functional)', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let mockNavigationService: jest.Mocked<NavigationService>;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockNavigationService = {
      navigateToSignIn: jest.fn(),
    } as unknown as jest.Mocked<NavigationService>;
  });

  it('should return true when user is authenticated', () => {
    (inject as jest.Mock).mockImplementation((token) => {
      if (token === AuthService) return mockAuthService;
      if (token === NavigationService) return mockNavigationService;
    });

    mockAuthService.isAuthenticated.mockReturnValue(true);

    const result = authGuard({} as any, {} as any); // <- FIXED

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(result).toBe(true);
    expect(mockNavigationService.navigateToSignIn).not.toHaveBeenCalled();
  });

  it('should navigate to sign-in and return false when user is not authenticated', () => {
    (inject as jest.Mock).mockImplementation((token) => {
      if (token === AuthService) return mockAuthService;
      if (token === NavigationService) return mockNavigationService;
    });

    mockAuthService.isAuthenticated.mockReturnValue(false);

    const result = authGuard({} as any, {} as any);

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockNavigationService.navigateToSignIn).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
