import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { ViewOnlyLinkHelperMock } from '@testing/providers/view-only-link-helper.mock';

import { viewOnlyGuard } from './view-only.guard';

describe('viewOnlyGuard', () => {
  let router: Router;
  let viewOnlyHelper: ViewOnlyLinkHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(Router, RouterMockBuilder.create().withUrl('/test').build()),
        MockProvider(ViewOnlyLinkHelperService, ViewOnlyLinkHelperMock.simple()),
      ],
    });

    router = TestBed.inject(Router);
    viewOnlyHelper = TestBed.inject(ViewOnlyLinkHelperService);
  });

  it('should return true when no view-only param exists', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      viewOnlyGuard({ routeConfig: { path: 'test' } } as any, {} as any)
    );

    expect(result).toBe(true);
    expect(viewOnlyHelper.hasViewOnlyParam).toHaveBeenCalledWith(router);
  });

  it('should return true when view-only param exists but route is not blocked', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      viewOnlyGuard({ routeConfig: { path: 'allowed-route' } } as any, {} as any)
    );

    expect(result).toBe(true);
    expect(viewOnlyHelper.hasViewOnlyParam).toHaveBeenCalledWith(router);
  });

  it('should navigate to overview when view-only param exists and route is blocked with valid navigation params', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('abc123');
    Object.defineProperty(router, 'url', { value: '/resource-123/some-path', writable: true });

    const result = TestBed.runInInjectionContext(() =>
      viewOnlyGuard({ routeConfig: { path: 'metadata' } } as any, {} as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['resource-123', 'overview'], {
      queryParams: { view_only: 'abc123' },
    });
  });

  it('should navigate to root when view-only param exists and route is blocked but no valid navigation params', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue(null);
    Object.defineProperty(router, 'url', { value: '/invalid-url', writable: true });

    const result = TestBed.runInInjectionContext(() =>
      viewOnlyGuard({ routeConfig: { path: 'metadata' } } as any, {} as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to overview when route path starts with blocked route prefix', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);
    vi.spyOn(viewOnlyHelper, 'getViewOnlyParam').mockReturnValue('xyz789');
    Object.defineProperty(router, 'url', { value: '/resource-456/metadata/subpath', writable: true });

    const result = TestBed.runInInjectionContext(() =>
      viewOnlyGuard({ routeConfig: { path: 'metadata/subpath' } } as any, {} as any)
    );

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['resource-456', 'overview'], {
      queryParams: { view_only: 'xyz789' },
    });
  });

  it('should handle empty route path gracefully', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => viewOnlyGuard({ routeConfig: { path: '' } } as any, {} as any));

    expect(result).toBe(true);
  });

  it('should handle undefined route config gracefully', () => {
    vi.spyOn(viewOnlyHelper, 'hasViewOnlyParam').mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => viewOnlyGuard({ routeConfig: undefined } as any, {} as any));

    expect(result).toBe(true);
  });
});
