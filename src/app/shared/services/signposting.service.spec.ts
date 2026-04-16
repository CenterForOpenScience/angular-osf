import { DOCUMENT } from '@angular/common';
import { RESPONSE_INIT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LINKSET_JSON_TYPE, LINKSET_TYPE } from '@osf/shared/models/signposting.model';

import { provideOSFCore } from '@testing/osf.testing.provider';

import { SignpostingService } from './signposting.service';

describe('Service: Signposting', () => {
  let service: SignpostingService;
  let documentRef: Document;

  const setup = (responseInit?: ResponseInit) => {
    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        SignpostingService,
        ...(responseInit ? [{ provide: RESPONSE_INIT, useValue: responseInit }] : []),
      ],
    });

    service = TestBed.inject(SignpostingService);
    documentRef = TestBed.inject(DOCUMENT);
    service.removeSignpostingLinkTags();
  };

  afterEach(() => {
    if (service) {
      service.removeSignpostingLinkTags();
    }
  });

  it('should add linkset signposting tags', () => {
    setup();

    service.addSignposting('abc123');

    const linksetTags = Array.from(documentRef.head.querySelectorAll('link[rel="linkset"]'));
    const hrefs = linksetTags.map((tag) => tag.getAttribute('href'));
    const types = linksetTags.map((tag) => tag.getAttribute('type'));

    expect(linksetTags).toHaveLength(2);
    expect(hrefs).toContain('http://localhost:4200/metadata/abc123/?format=linkset');
    expect(hrefs).toContain('http://localhost:4200/metadata/abc123/?format=linkset-json');
    expect(types).toContain(LINKSET_TYPE);
    expect(types).toContain(LINKSET_JSON_TYPE);
  });

  it('should add metadata signposting tag', () => {
    setup();

    service.addMetadataSignposting('abc123');

    const describesTags = Array.from(documentRef.head.querySelectorAll('link[rel="describes"]'));

    expect(describesTags).toHaveLength(1);
    expect(describesTags[0].getAttribute('href')).toBe('http://localhost:4200/abc123/');
    expect(describesTags[0].getAttribute('type')).toBe('text/html');
  });

  it('should remove only signposting tags', () => {
    setup();
    const extraLink = documentRef.createElement('link');
    extraLink.setAttribute('rel', 'stylesheet');
    documentRef.head.appendChild(extraLink);
    service.addSignposting('abc123');
    service.addMetadataSignposting('abc123');

    service.removeSignpostingLinkTags();

    expect(documentRef.head.querySelectorAll('link[rel="linkset"]')).toHaveLength(0);
    expect(documentRef.head.querySelectorAll('link[rel="describes"]')).toHaveLength(0);
    expect(documentRef.head.querySelectorAll('link[rel="stylesheet"]')).toHaveLength(1);
  });

  it('should set link headers for addSignposting when response init headers are plain object', () => {
    const responseInit: ResponseInit = { headers: {} };
    setup(responseInit);

    service.addSignposting('abc123');

    expect(responseInit.headers).toBeInstanceOf(Headers);
    const linkHeader = (responseInit.headers as Headers).get('Link');

    expect(linkHeader).toContain(
      '<http://localhost:4200/metadata/abc123/?format=linkset>; rel="linkset"; type="application/linkset"'
    );
    expect(linkHeader).toContain(
      '<http://localhost:4200/metadata/abc123/?format=linkset-json>; rel="linkset"; type="application/linkset+json"'
    );
  });

  it('should set link headers for addMetadataSignposting when response init headers are Headers', () => {
    const headers = new Headers();
    const responseInit: ResponseInit = { headers };
    setup(responseInit);

    service.addMetadataSignposting('abc123');

    expect(responseInit.headers).toBe(headers);
    expect(headers.get('Link')).toBe('<http://localhost:4200/abc123/>; rel="describes"; type="text/html"');
  });
});
