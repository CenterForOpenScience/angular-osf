import { Store } from '@ngxs/store';

import { of } from 'rxjs';

import { DatePipe } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { MetaTagsService } from '@osf/shared/services';
import { Identifier } from '@shared/models';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { RegistryComponent } from './registry.component';

describe('RegistryComponent', () => {
  let fixture: any;
  let dataciteService: jest.Mocked<DataciteService>;

  const registrySignal = signal<any | null>(null);

  beforeEach(async () => {
    dataciteService = {
      logView: jest.fn().mockReturnValue(of(void 0)),
    } as unknown as jest.Mocked<DataciteService>;

    const mockStore = {
      selectSignal: jest.fn((selector: any) => {
        if (selector === RegistryOverviewSelectors.getRegistry) {
          return registrySignal; // return a signal, not an observable
        }
        return signal(null);
      }),
    };

    await TestBed.configureTestingModule({
      imports: [RegistryComponent], // standalone component
      providers: [
        { provide: Store, useValue: mockStore },
        DatePipe,
        { provide: DataciteService, useValue: dataciteService },
        {
          provide: MetaTagsService,
          useValue: { updateMetaTags: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryComponent);
    TestBed.inject(MetaTagsService);
  });

  it('reacts to sequence of state changes', () => {
    registrySignal.set(null);
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    registrySignal.set(getRegistry([]));

    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    registrySignal.set(getRegistry([{ category: 'dio', value: '123', id: '', type: 'identifier' }]));
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalledTimes(0);

    registrySignal.set(getRegistry([{ category: 'doi', value: '123', id: '', type: 'identifier' }]));

    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenCalled();

    registrySignal.set(getRegistry([{ category: 'doi', value: '456', id: '', type: 'identifier' }]));
    fixture.detectChanges();
    expect(dataciteService.logView).toHaveBeenLastCalledWith('123');
  });
});

function getRegistry(identifiers: Identifier[]) {
  return {
    id: 'r1',
    title: 'Mock Registry',
    description: 'Test description',
    dateRegistered: new Date('2023-01-01'),
    dateModified: new Date('2023-02-01'),
    doi: '10.1000/mockdoi',
    tags: ['angular', 'jest'],
    license: { name: 'MIT' },
    contributors: [
      { givenName: 'Alice', familyName: 'Smith' },
      { givenName: 'Bob', familyName: 'Brown' },
    ],
    identifiers: identifiers,
  };
}
