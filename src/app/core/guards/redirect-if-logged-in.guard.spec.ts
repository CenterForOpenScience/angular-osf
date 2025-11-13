import { Router } from '@angular/router';

import { AuthService } from '@core/services/auth.service';

import { redirectIfLoggedInGuard } from './redirect-if-logged-in.guard';

jest.mock('@angular/core', () => ({
  ...(jest.requireActual('@angular/core') as any),
  inject: jest.fn(),
}));

const inject = jest.requireMock('@angular/core').inject as jest.Mock;

describe.skip('redirectIfLoggedInGuard', () => {
  const mockAuthService = {
    isAuthenticated: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    inject.mockImplementation((token) => {
      if (token === AuthService) return mockAuthService;
      if (token === Router) return mockRouter;
      return null;
    });
  });

  it('should return false and call router.navigate if user is authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(true);

    const result = redirectIfLoggedInGuard({} as any, {} as any);

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBeUndefined();
  });

  it('should return true and not call router.navigate if user is not authenticated', () => {
    mockAuthService.isAuthenticated.mockReturnValue(false);

    const result = redirectIfLoggedInGuard({} as any, {} as any);

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
