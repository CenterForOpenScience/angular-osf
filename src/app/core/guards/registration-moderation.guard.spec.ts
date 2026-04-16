import { Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, Observable } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { GetRegistryProvider, RegistrationProviderSelectors } from '@osf/shared/stores/registration-provider';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { RouterMockBuilder, RouterMockType } from '@testing/providers/router-provider.mock';
import { provideMockStore } from '@testing/providers/store-provider.mock';

import { registrationModerationGuard } from './registration-moderation.guard';

describe('registrationModerationGuard', () => {
  let store: Store;
  let router: RouterMockType;

  function setup({
    snapshotProvider,
    selectedProvider,
  }: {
    snapshotProvider?: { reviewsWorkflow?: string | null } | null;
    selectedProvider?: { reviewsWorkflow?: string | null } | null;
  }) {
    router = RouterMockBuilder.create()
      .withUrl('/registries/provider')
      .withNavigate(vi.fn().mockResolvedValue(true))
      .build();

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideMockStore({
          selectors: [
            {
              selector: RegistrationProviderSelectors.getBrandedProvider,
              value: selectedProvider ?? snapshotProvider ?? null,
            },
          ],
        }),
        MockProvider(Router, router),
      ],
    });

    store = TestBed.inject(Store);
    vi.spyOn(store, 'selectSnapshot').mockReturnValue(snapshotProvider ?? null);
  }

  async function resolveGuard(providerId = 'osf') {
    const route = { params: { providerId } } as never;
    const result = TestBed.runInInjectionContext(() => registrationModerationGuard(route, {} as never));
    if (typeof result === 'boolean') {
      return result;
    }
    return firstValueFrom(result as Observable<boolean>);
  }

  it('should return true immediately when provider already has reviews workflow', async () => {
    setup({
      snapshotProvider: { reviewsWorkflow: 'pre-moderation' },
    });

    const result = await resolveGuard();

    expect(result).toBe(true);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return true after fetch when provider has reviews workflow', async () => {
    setup({
      snapshotProvider: { reviewsWorkflow: null },
      selectedProvider: { reviewsWorkflow: 'post-moderation' },
    });

    const result = await resolveGuard('osf');

    expect(result).toBe(true);
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryProvider('osf'));
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to not found and return false when provider has no reviews workflow', async () => {
    setup({
      snapshotProvider: null,
      selectedProvider: { reviewsWorkflow: null },
    });

    const result = await resolveGuard('ecsar');

    expect(result).toBe(false);
    expect(store.dispatch).toHaveBeenCalledWith(new GetRegistryProvider('ecsar'));
    expect(router.navigate).toHaveBeenCalledWith(['/not-found']);
  });
});
