import { TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { SENTRY_PROVIDER, SENTRY_TOKEN } from './sentry.provider';

import * as Sentry from '@sentry/angular';

describe('Provider: Sentry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), SENTRY_PROVIDER],
    });
  });

  it('should provide the Sentry module via the injection token', () => {
    const provided = TestBed.inject(SENTRY_TOKEN);
    expect(provided).toBe(Sentry);
    expect(typeof provided.captureException).toBe('function');
  });
});
