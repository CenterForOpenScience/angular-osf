import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { Mock } from 'vitest';

import { DestroyRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PrerenderReadyService } from '@core/services/prerender-ready.service';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { PrerenderReadyServiceMockFactory } from '@testing/providers/prerender-ready.service.mock';

import { MetaTagsService } from './meta-tags.service';
import { MetadataRecordsService } from './metadata-records.service';

describe('MetaTagsService', () => {
  let service: MetaTagsService;
  let metadataRecordsMock: { getMetadataRecord: Mock };

  beforeEach(() => {
    metadataRecordsMock = { getMetadataRecord: vi.fn().mockReturnValue(of('')) };

    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        MockProvider(MetadataRecordsService, metadataRecordsMock),
        MockProvider(PrerenderReadyService, PrerenderReadyServiceMockFactory()),
      ],
    });

    service = TestBed.inject(MetaTagsService);
  });

  afterEach(() => {
    service.clearMetaTags();
  });

  it('adds canonical link from url', () => {
    const destroyRef = {
      onDestroy: vi.fn(),
    } as unknown as DestroyRef;

    service.updateMetaTags(
      {
        title: 'Title',
        url: 'http://localhost:4200/ezcuj/overview',
      },
      destroyRef
    );

    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('http://localhost:4200/ezcuj/overview');
  });

  it('uses canonicalUrl when it differs from url', () => {
    const destroyRef = {
      onDestroy: vi.fn(),
    } as unknown as DestroyRef;

    service.updateMetaTags(
      {
        title: 'Title',
        url: 'http://localhost:4200/ezcuj',
        canonicalUrl: 'http://localhost:4200/ezcuj/overview',
      },
      destroyRef
    );

    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe('http://localhost:4200/ezcuj/overview');
  });

  it('replaces canonical link when updated again', () => {
    const destroyRef = {
      onDestroy: vi.fn(),
    } as unknown as DestroyRef;

    service.updateMetaTags(
      {
        title: 'Title 1',
        url: 'http://localhost:4200/ezcuj/overview',
      },
      destroyRef
    );

    service.updateMetaTags(
      {
        title: 'Title 2',
        url: 'http://localhost:4200/abcd1/overview',
      },
      destroyRef
    );

    const canonicalLinks = document.head.querySelectorAll('link[rel="canonical"]');
    expect(canonicalLinks.length).toBe(1);
    expect(canonicalLinks[0]?.getAttribute('href')).toBe('http://localhost:4200/abcd1/overview');
  });

  it('removes canonical link on destroy callback', () => {
    let destroyCallback: (() => void) | undefined;
    const destroyRef = {
      onDestroy: vi.fn((cb: () => void) => {
        destroyCallback = cb;
      }),
    } as unknown as DestroyRef;

    service.updateMetaTags(
      {
        title: 'Title',
        url: 'http://localhost:4200/ezcuj/overview',
      },
      destroyRef
    );

    destroyCallback?.();

    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical).toBeNull();
  });
});
