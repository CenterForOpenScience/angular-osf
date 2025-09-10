import { Store } from '@ngxs/store';

import { DatePipe } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RegistryOverviewSelectors } from '@osf/features/registry/store/registry-overview';
import { MetaTagsService } from '@osf/shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { RegistryComponent } from './registry.component';

import { DataciteMockFactory } from '@testing/mocks/datacite.service.mock';

describe('RegistryComponent', () => {
  let fixture: any;
  let component: RegistryComponent;
  let dataciteService: jest.Mocked<DataciteService>;

  const registrySignal = signal<any | null>(null);

  beforeEach(async () => {
    dataciteService = DataciteMockFactory();

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
    component = fixture.componentInstance;
    TestBed.inject(MetaTagsService);
  });

  it('reacts to sequence of state changes', () => {
    fixture.detectChanges();
    expect(dataciteService.logIdentifiableView).toHaveBeenCalledWith(component.registry$);
  });
});
