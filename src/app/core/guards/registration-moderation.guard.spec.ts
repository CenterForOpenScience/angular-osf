import { of } from 'rxjs';

import { runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { GetRegistryProvider, RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';

import { registrationModerationGuard } from './registration-moderation.guard';

import { RouterMockBuilder } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

describe('registrationModerationGuard', () => {
  let router: Router;

  const createMockProvider = (overrides?: Partial<any>) => ({
    id: 'provider-123',
    name: 'Test Provider',
    descriptionHtml: '<p>Test</p>',
    permissions: [],
    brand: null,
    iri: 'http://example.com/provider',
    reviewsWorkflow: 'enabled',
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [],
          actions: [],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
      ],
    });

    router = TestBed.inject(Router);
    jest.clearAllMocks();
  });

  it('should return true when provider already exists with reviewsWorkflow', () => {
    const provider = createMockProvider({ reviewsWorkflow: 'enabled' });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: RegistrationProviderSelectors.getBrandedProvider,
              value: provider,
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    const result = runInInjectionContext(TestBed, () =>
      registrationModerationGuard({ params: { providerId: 'provider-123' } } as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('should navigate to not-found and return false when provider exists without reviewsWorkflow', (done) => {
    const provider = createMockProvider({ reviewsWorkflow: '' });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: RegistrationProviderSelectors.getBrandedProvider,
              value: provider,
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    const result = runInInjectionContext(TestBed, () =>
      registrationModerationGuard({ params: { providerId: 'provider-123' } } as any, {} as any)
    );

    if (typeof result === 'object' && 'subscribe' in result) {
      result.subscribe((value) => {
        expect(value).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
        done();
      });
    } else {
      expect(result).toBe(false);
      done();
    }
  });

  it('should dispatch GetRegistryProvider and return observable when provider does not exist initially', (done) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: RegistrationProviderSelectors.getBrandedProvider,
              value: null,
            },
          ],
          actions: [
            {
              action: new GetRegistryProvider('provider-123'),
              value: of(true),
            },
          ],
        }),
        {
          provide: Router,
          useValue: RouterMockBuilder.create().withUrl('/test').build(),
        },
      ],
    });

    router = TestBed.inject(Router);

    const result = runInInjectionContext(TestBed, () =>
      registrationModerationGuard({ params: { providerId: 'provider-123' } } as any, {} as any)
    );

    expect(typeof result === 'object' && 'subscribe' in result).toBe(true);
    done();
  });
});
