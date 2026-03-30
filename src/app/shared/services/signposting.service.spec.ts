import { RendererFactory2, RESPONSE_INIT } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SignpostingService } from './signposting.service';

describe('Service: Signposting', () => {
  let service: SignpostingService;
  let mockResponseInit: ResponseInit;
  let createdLinks: Record<string, string>[];
  let mockAppendChild: jest.Mock;

  beforeEach(() => {
    createdLinks = [];
    mockAppendChild = jest.fn();
    mockResponseInit = { headers: new Headers() };

    TestBed.configureTestingModule({
      providers: [
        SignpostingService,
        { provide: RESPONSE_INIT, useValue: mockResponseInit },
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer: () => ({
              createElement: jest.fn().mockImplementation(() => {
                const link: Record<string, string> = {};
                createdLinks.push(link);
                return link;
              }),
              setAttribute: jest.fn().mockImplementation((el, attr, value) => {
                el[attr] = value;
              }),
              appendChild: mockAppendChild,
            }),
          },
        },
      ],
    });

    service = TestBed.inject(SignpostingService);
  });

  it('should set headers using addSignposting', () => {
    service.addSignposting('abcde');
    const linkHeader = (mockResponseInit.headers as Headers).get('Link');
    expect(linkHeader).toBe(
      '<https://staging3.osf.io/metadata/abcde/?format=linkset>; rel="linkset"; type="application/linkset", <https://staging3.osf.io/metadata/abcde/?format=linkset-json>; rel="linkset"; type="application/linkset+json"'
    );
  });

  it('should add link tags using addSignposting', () => {
    service.addSignposting('abcde');

    expect(createdLinks).toEqual([
      {
        rel: 'linkset',
        href: 'https://staging3.osf.io/metadata/abcde/?format=linkset',
        type: 'application/linkset',
      },
      {
        rel: 'linkset',
        href: 'https://staging3.osf.io/metadata/abcde/?format=linkset-json',
        type: 'application/linkset+json',
      },
    ]);
    expect(mockAppendChild).toHaveBeenCalledTimes(2);
  });
});
