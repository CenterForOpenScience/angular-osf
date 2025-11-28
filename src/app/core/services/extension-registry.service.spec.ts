import { TestBed } from '@angular/core/testing';

import { FileActionExtension } from '@osf/shared/tokens/file-action-extensions.token';

import { ExtensionRegistry } from './extension-registry.service';

describe('ExtensionRegistry', () => {
  let service: ExtensionRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionRegistry);
  });

  it('registers extensions cumulatively', () => {
    const extA: FileActionExtension = {
      id: 'a',
      label: 'A',
      icon: 'a',
      command: jest.fn(),
    };
    const extB: FileActionExtension = {
      id: 'b',
      label: 'B',
      icon: 'b',
      command: jest.fn(),
    };

    service.register([extA]);
    service.register([extB]);

    expect(service.extensions()).toEqual([extA, extB]);
  });
});
